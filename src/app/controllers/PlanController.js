import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
  async index(req, res) {
    const plans = await Plan.findAll({
      attributes: ['id', 'title', 'duration', 'price'],
      order: ['id'],
    });
    return res.json(plans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Valation fails.' });
    }

    const { title } = req.body;

    const titleExists = await Plan.findOne({
      where: { title },
    });

    if (titleExists) {
      res.status(400).json({ error: 'This title already exists' });
    }

    const plan = await Plan.create(req.body);

    return res.json(plan);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number(),
      price: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Valation fails.' });
    }

    const { index } = req.params;
    const { title } = req.body;

    const plan = await Plan.findByPk(index);

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    if (!plan.title) {
      return res.status(400).json({ error: 'ID plan is invalid' });
    }

    if (title !== plan.title) {
      const planExists = await Plan.findOne({
        where: { title },
      });

      if (planExists) {
        return res.status(400).json({ error: 'This title already exists' });
      }
    }

    const updatedPlan = await plan.update(req.body);

    return res.json(updatedPlan);
  }

  async delete(req, res) {
    const { index } = req.params;
    const plan = await Plan.findByPk(index);

    if (!plan) {
      res.status(400).json({ error: "This plain don't exists or deleted" });
    }

    try {
      await Plan.destroy({
        where: {
          id: index,
        },
      });
    } catch (error) {
      return res.json(error);
    }

    return res.status(200).json({
      message: `Plan ${plan.title} deleted with success`,
    });
  }
}

export default new PlanController();
