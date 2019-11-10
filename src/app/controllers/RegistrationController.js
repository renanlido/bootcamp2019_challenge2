import * as Yup from 'yup';
import { addMonths, isBefore, parseISO, format } from 'date-fns';
import { Op } from 'sequelize';
// import ptBR from 'date-fns/locale/pt-BR';

import Registration from '../models/Registration';
import Plan from '../models/Plan';
import Student from '../models/Student';

class RegistrationController {
  async index(req, res) {
    const entries = await Registration.findAll({
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
    // const student = await Student.findByPk(student_id);

    const price = plan.price * plan.duration;

    const parsedDate = parseISO(start_date);

    if (isBefore(parsedDate, new Date())) {
      return res.status(400).json({ error: 'Past date are not permited' });
    }

    const end_date = format(
      addMonths(parsedDate, plan.duration),
      "yyyy-MM-dd'T'HH:mm:ssxxx"
    );

    const activePlan = await Registration.findAll({
      where: {
        student_id,
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

    return res.json(register);
  }
}

export default new RegistrationController();
