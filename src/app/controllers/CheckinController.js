import { subDays } from 'date-fns';
import { Op } from 'sequelize';
import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async index(req, res) {
    const { index } = req.params;

    const checkins = await Checkin.findAll({
      where: {
        student_id: index,
      },
      attributes: ['id', 'created_at'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name'],
        },
      ],
    });

    return res.json(checkins);
  }

  async store(req, res) {
    const { index } = req.params;
    const student = await Student.findByPk(index);
    const date = new Date();

    if (!student) {
      return res.status(404).json({ error: 'Student not exists or deleted' });
    }

    const checkins = await Checkin.findAndCountAll({
      where: {
        student_id: index,
        created_at: {
          [Op.between]: [subDays(date, 7), date],
        },
      },
    });

    if (checkins.count >= 5) {
      return res
        .status(401)
        .json({ error: 'You can only do 5 check in per week' });
    }

    const checkin = await Checkin.create({
      student_id: index,
    });

    return res.json(checkin);
  }
}

export default new CheckinController();
