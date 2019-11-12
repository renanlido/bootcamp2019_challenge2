import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

class UnansweredHelpOrderController {
  async index(req, res) {
    const unansweredHelpOrders = await HelpOrder.findAndCountAll({
      where: { answer: null },
      attributes: ['id', 'question'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name'],
        },
      ],
    });

    if (unansweredHelpOrders.count === 0) {
      return res
        .status(200)
        .json({ message: 'No new unanswered help orders for now.' });
    }
    return res.json(unansweredHelpOrders);
  }
}

export default new UnansweredHelpOrderController();
