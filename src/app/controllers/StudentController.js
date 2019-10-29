import * as Yup from 'yup';
import User from '../models/Student';

class StudentController {
  async store(req, res) {
    // Validation schema creation new user
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

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const { id, name, email, year_birth, weight, height } = await User.create(
      req.body
    );
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
    // Validation schema update user
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

    const user = await User.findByPk(index);

    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
      }
    }

    const { id, name, year_birth, weight, height } = await user.update(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      year_birth,
      weight,
      height,
    });
  }
}

export default new StudentController();
