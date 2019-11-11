import * as Yup from 'yup';
import { addMonths, isBefore, parseISO, format } from 'date-fns';
import { Op } from 'sequelize';
// import ptBR from 'date-fns/locale/pt-BR';

import registrationMail from '../jobs/registrationMail';
import Queue from '../../lib/Queue';

import Registration from '../models/Registration';
import Plan from '../models/Plan';
import Student from '../models/Student';

class RegistrationController {
  async index(req, res) {
    const entries = await Registration.findAll({
      where: {
        canceled_at: null,
      },
      attributes: ['id', 'start_date', 'end_date', 'price'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'duration', 'price'],
        },
      ],
      order: ['id'],
    });
    return res.json(entries);
  }

  async create(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Valation fails.' });
    }

    const { student_id, plan_id, start_date } = req.body;

    const plan = await Plan.findByPk(plan_id);
    const student = await Student.findByPk(student_id);

    if (!plan) {
      return res.status(404).json({ error: 'Plan not exists' });
    }

    const price = plan.price * plan.duration;

    const parsedDate = parseISO(start_date);

    if (isBefore(parsedDate, new Date())) {
      return res.status(400).json({ error: 'Past date are not permited' });
    }

    const end_date = addMonths(parsedDate, plan.duration);

    const activePlan = await Registration.findOne({
      where: {
        student_id,
        canceled_at: null,
      },
      date: {
        [Op.between]: [start_date, end_date],
      },
    });

    if (activePlan) {
      return res
        .status(400)
        .json({ error: 'There is already an active plan in this period.' });
    }

    const register = await Registration.create({
      student_id,
      plan_id,
      start_date: parsedDate,
      end_date,
      price,
    });

    await Queue.add(registrationMail.key, {
      student,
      plan,
      end_date,
    });

    return res.json(register);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number(),
      plan_id: Yup.number(),
      start_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Valation fails.' });
    }

    const { index } = req.params;
    const { student_id, plan_id, start_date } = req.body;

    const register = await Registration.findOne({
      where: {
        id: index,
        canceled_at: null,
      },
    });

    const plan = await Plan.findByPk(plan_id);

    if (!register) {
      return res.status(404).json({ error: 'register not exists' });
    }

    if (!plan) {
      return res.status(404).json({ error: 'Plan not exists' });
    }

    const price = plan.price * plan.duration;

    const parsedDate = parseISO(start_date);

    if (isBefore(parsedDate, new Date())) {
      return res.status(400).json({ error: 'Past date are not permited' });
    }

    const end_date = format(
      addMonths(parsedDate, plan.duration),
      "yyyy-MM-dd'T'HH:mm:ssxxx"
    );

    // Checking for Active Registration
    if (student_id !== register.student_id) {
      const registerExists = await Registration.findOne({
        where: {
          student_id,
          canceled_at: null,
        },
      });

      if (registerExists) {
        return res.status(400).json({
          error:
            'This student already has an active plan. Please change this plan.',
        });
      }
    }

    // Update register
    await register.update({
      student_id,
      plan_id,
      start_date: parsedDate,
      end_date,
      price,
    });

    return res.json(register);
  }

  async delete(req, res) {
    const { index } = req.params;

    const register = await Registration.findByPk(index);

    register.canceled_at = new Date();

    try {
      await register.save();
    } catch (err) {
      return res.status(400).json({
        error: 'The registration was not canceled, an error occurred.',
      });
    }

    return res.json(register);
  }
}

export default new RegistrationController();
