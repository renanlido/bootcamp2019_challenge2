import { Op } from 'sequelize';
import { subDays, startOfDay, endOfDay } from 'date-fns';
import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async index(req, res) {
    const { id } = req.params;

    const checkins = await Checkin.findAll({
      where: { student_id: id },
      attributes: ['id', 'student_id', 'checkin_date'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });

    if (checkins.length < 1) {
      return res
        .status(200)
        .json({ message: 'This student not have checkins' });
    }

    return res.json(checkins);
  }

  async store(req, res) {
    const { id } = req.params;

    const studentExists = await Student.findByPk(id);

    if (!studentExists) {
      return res.status(400).json({ error: 'This student not exists' });
    }

    const atualDate = new Date();

    const countCheckin = await Checkin.findAndCountAll({
      where: {
        student_id: id,
        checkin_date: {
          [Op.between]: [
            subDays(startOfDay(atualDate), 7),
            endOfDay(atualDate),
          ],
        },
      },
    });

    if (countCheckin.count >= 5) {
      return res
        .status(401)
        .json({ message: "You've already checked in 5 this week" });
    }

    const checkin = await Checkin.create({
      student_id: id,
      checkin_date: new Date(),
    });

    return res.json(checkin);
  }
}

export default new CheckinController();
