import { subDays, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Checkin from '../models/Checkin';
import Student from '../models/Student';
import Registration from '../models/Registration';

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
      order: ['id'],
    });

    return res.json(checkins);
  }

  async store(req, res) {
    const student_id = req.params.index;
    const student = await Student.findByPk(student_id);
    const date = new Date();

    if (!student) {
      return res.status(404).json({ error: 'Student not exists or deleted' });
    }

    const register = await Registration.findOne({
      where: {
        student_id,
      },
    });

    if (register.canceled_at) {
      return res.status(401).json({ error: 'Your plan is canceled' });
    }

    if (register.expired) {
      return res.status(401).json({ error: 'Your plan is expired.' });
    }

    const checkins = await Checkin.findAndCountAll({
      where: {
        student_id,
        created_at: {
          [Op.between]: [startOfDay(subDays(date, 7)), endOfDay(date)],
        },
      },
    });

    if (checkins.count >= 5) {
      return res
        .status(401)
        .json({ error: 'You can only do 5 check in per week' });
    }

    const checkin = await Checkin.create({
      student_id,
    });

    return res.json(checkin);
  }
}

export default new CheckinController();
