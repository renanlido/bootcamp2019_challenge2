import { startOfDay, endOfDay, addMonths, parseISO, isBefore } from 'date-fns';
import * as Yup from 'yup';
import Registration from '../models/Registration';
import Plan from '../models/Plan';
import Student from '../models/Student';

import RegistrationMail from '../jobs/RegistrationMail';
import Queue from '../../lib/Queue';

class RegistrationController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const registers = await Registration.findAll({
      where: { canceled_at: null },
      attributes: [
        'id',
        'start_date',
        'end_date',
        'price',
        'expired',
        'canceled_at',
      ],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['title', 'duration', 'price'],
        },
      ],
      order: ['id'],
    });
    return res.json(registers);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student_id, plan_id, start_date } = req.body;

    const startDate = startOfDay(parseISO(start_date));

    const student = await Student.findByPk(student_id);
    const plan = await Plan.findByPk(plan_id);
    const register = await Registration.findOne({
      where: { student_id, canceled_at: null },
    });

    if (!student) {
      return res.status(400).json({ error: 'This student not exists' });
    }

    if (!plan) {
      return res.status(400).json({ error: 'This plan not exists' });
    }

    if (register && register.expired === false) {
      return res
        .status(400)
        .json({ error: 'This student already has an active plan' });
    }

    const endDate = addMonths(endOfDay(startDate), plan.duration);
    const price = plan.price * plan.duration;

    const registration = await Registration.create({
      student_id,
      plan_id,
      start_date: startDate,
      end_date: endDate,
      price,
    });

    await Queue.add(RegistrationMail.key, {
      student,
      plan,
      price,
      startDate,
      endDate,
    });

    return res.json(registration);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number(),
      plan_id: Yup.number(),
      start_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { plan_id, student_id, start_date } = req.body;

    const startDate = startOfDay(parseISO(start_date));

    const register = await Registration.findByPk(req.params.id);

    if (register.canceled_at) {
      return res.status(400).json({ error: 'This plan has canceled' });
    }

    if (student_id !== register.student_id) {
      const student = await Student.findByPk(student_id);
      const registerExists = await Registration.findOne({
        where: { student_id },
      });

      if (!student) {
        return res.status(400).json({ error: 'This student does not exists' });
      }

      if (registerExists && registerExists.expired === false) {
        return res
          .status(400)
          .json({ error: 'This student already has an active plan' });
      }
    }

    let { price, end_date } = register;

    const plan = await Plan.findByPk(plan_id);

    if (plan_id !== register.plan_id) {
      if (!plan) {
        return res.status(400).json({ error: 'This plan not exists' });
      }
      end_date = addMonths(endOfDay(startDate), plan.duration);
      price = plan.price * plan.duration;
    }

    if (isBefore(end_date, new Date())) {
      return res.status(400).json({ error: 'This date are not permited' });
    }

    const registerUpdate = await register.update({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });

    return res.json(registerUpdate);
  }

  async delete(req, res) {
    const register = await Registration.findByPk(req.params.id, {
      attributes: [
        'id',
        'start_date',
        'end_date',
        'price',
        'expired',
        'canceled_at',
      ],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['title', 'duration', 'price'],
        },
      ],
    });

    if (register.expired) {
      return res.status(401).json({ error: 'This plan has expired' });
    }

    register.canceled_at = new Date();

    await register.save();

    return res.json(register);
  }
}

export default new RegistrationController();
