import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
  async index(req, res) {
    const students = await Student.findAll({
      attributes: ['id', 'name', 'email', 'year_birth', 'weight', 'height'],
      order: ['id'],
    });
    return res.json(students);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      year_birth: Yup.number().required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });

    if (studentExists) {
      return res.status(400).json({ error: 'This student already exists' });
    }

    const { name, email, year_birth, weight, height } = await Student.create(
      req.body
    );

    return res.json({ name, email, year_birth, weight, height });
  }

  async update(req, res, next) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      year_birth: Yup.number(),
      weight: Yup.number(),
      height: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const { email } = req.body;
    const { index } = req.params;

    const student = await Student.findByPk(index);

    if (email !== student.email) {
      const studentExists = await Student.findOne({ where: { email } });

      if (studentExists) {
        return res.status(400).json({ error: 'This student alreadry exists' });
      }
    }

    const { name, year_birth, weight, height } = req.body;

    try {
      await student.update(req.body);
      next();
    } catch (error) {
      res.status(400).json({ error: 'Problem on server' });
    }

    return res.json({ name, email, year_birth, weight, height });
  }
}

export default new StudentController();
