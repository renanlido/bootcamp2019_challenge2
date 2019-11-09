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
    const titleExists = await Plan.findOne({
      where: { title: req.body.title },
    });

    if (titleExists) {
      res.status(400).json({ error: 'This title already exists' });
    }

    const { id, title, duration, price } = await Plan.create(req.body);

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async update(req, res) {
    const { title } = req.body;

    const titleExists = await Plan.findOne({
      where: {
        title,
      },
    });

    if (titleExists) {
      return res.status(400).json({ error: 'This title already exists' });
    }

    const plan = await Plan.findByPk(req.params.id);

    const { id, duration, price } = await plan.update(req.body);

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async delete(req, res) {
    const { id } = req.params;
    const plan = await Plan.findByPk(id);

    if (!plan) {
      res.status(400).json({ error: "This plain don't exists or deleted" });
    }

    try {
      await Plan.destroy({
        where: {
          id,
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
