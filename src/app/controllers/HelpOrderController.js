import * as Yup from 'yup';

import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

class HelpOrderController {
  async index(req, res) {
    const student_id = req.params.index;

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const helpOrders = await HelpOrder.findAndCountAll({
      where: { student_id },
      attributes: ['id', 'question', 'answer', 'answer_at'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name'],
        },
      ],
    });

    if (helpOrders.count === 0) {
      return res.status(200).json({ message: 'Do you not have help orders' });
    }

    return res.json(helpOrders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const { question } = req.body;
    const student_id = req.params.index;

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const helpOrder = await HelpOrder.create({ student_id, question });

    return res.json(helpOrder);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const id = req.params.index;
    const { answer } = req.body;

    const helpOrder = await HelpOrder.findByPk(id);

    if (!helpOrder) {
      return res.status(404).json({ error: 'Help order not found' });
    }

    helpOrder.update({
      answer,
      answer_at: new Date(),
    });

    return res.json(helpOrder);
  }
}

export default new HelpOrderController();
