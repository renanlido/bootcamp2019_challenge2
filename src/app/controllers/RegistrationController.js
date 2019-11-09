import { addMonths, isBefore, parseISO, format } from 'date-fns';
// import ptBR from 'date-fns/locale/pt-BR';

import Registration from '../models/Registration';
import Plan from '../models/Plan';
// import Student from '../models/Student';

class RegistrationController {
  async index(req, res) {
    return res.json();
  }

  async create(req, res) {
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
