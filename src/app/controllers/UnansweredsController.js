import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

class UnansweredsController {
  async index(req, res) {
    const helpOrders = await HelpOrder.findAll({
      where: { answer_at: null },
      attributes: ['id', 'question', 'answer', 'answer_at'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });

    return res.json(helpOrders);
  }
}

export default new UnansweredsController();
