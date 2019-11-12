import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
  async index(req, res) {
    const students = await Student.findAll({
      attributes: ['id', 'name', 'email'],
      order: ['id'],
    });

    return res.json(students);
  }

  async store(req, res) {
    // Validation schema creation new student
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      yearBirth: Yup.number()
        .integer()
        .max(4),
      weight: Yup.number(),
      height: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });

    if (studentExists) {
      return res.status(400).json({ error: 'Student already exists' });
    }

    const {
      id,
      name,
      email,
      year_birth,
      weight,
      height,
    } = await Student.create(req.body);

    return res.json({
      id,
      name,
      email,
      year_birth,
      weight,
      height,
    });
  }

  async update(req, res) {
    // Validation schema update Student
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      yearBirth: Yup.number()
        .integer()
        .max(4),
      weight: Yup.number(),
      height: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const { email } = req.body;
    const { index } = req.params;

    const student = await Student.findByPk(index, {
      attributes: ['id', 'name', 'email', 'year_birth', 'weight', 'height'],
    });

    if (email !== student.email) {
      const studentExists = await Student.findOne({ where: { email } });

      if (studentExists) {
        return res.status(400).json({ error: 'Student already exists' });
      }
    }

    await student.update(req.body);

    return res.json(student);
  }
}

export default new StudentController();
