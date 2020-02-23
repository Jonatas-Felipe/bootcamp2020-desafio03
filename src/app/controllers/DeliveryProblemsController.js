import * as yup from 'yup';
import Entrega from '../models/Entrega';
import DeliveryProblems from '../models/DeliveryProblems';
import User from '../models/User';
import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

class DeliveryProblemsController {
  async index(req, res) {
    const deliveryProblems = await DeliveryProblems.findAll();
    return res.json(deliveryProblems);
  }

  async store(req, res) {
    const schema = yup.object().shape({
      description: yup.string().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação.' });
    }
    const delivery_id = req.params.id_entrega;

    const entrega = await Entrega.findOne({
      where: { id: delivery_id, canceled_at: null, end_date: null }
    });

    if (!entrega) {
      return res
        .status(400)
        .json({ error: 'Entrega cancelada, finalizada ou não encontrada.' });
    }

    const { description } = req.body;

    const deliveryProblems = await DeliveryProblems.create({
      delivery_id,
      description
    });

    return res.json(deliveryProblems);
  }

  async show(req, res) {
    const delivery_id = req.params.id_entrega;

    const deliveryProblems = await DeliveryProblems.findOne({
      where: { delivery_id }
    });

    if (!deliveryProblems) {
      return res.status(400).json({ error: 'Problema não encontrado.' });
    }

    return res.json(deliveryProblems);
  }

  async delete(req, res) {
    const id = req.params.id_problem;
    const deliveryProblems = await DeliveryProblems.findByPk(id);

    if (!deliveryProblems) {
      return res.status(400).json({ error: 'Problema não encontrado.' });
    }

    const { delivery_id, description } = deliveryProblems;

    const entrega = await Entrega.findOne({
      where: { id: delivery_id, canceled_at: null, end_date: null }
    });

    if (!entrega) {
      return res
        .status(400)
        .json({ error: 'Entrega cancelada, finalizada ou não encontrada.' });
    }

    await entrega.update({ canceled_at: new Date() });

    const { deliveryman_id, product } = entrega;
    const { name, email } = await User.findByPk(deliveryman_id);

    const data = { name, email, product, description };

    await Queue.add(CancellationMail.key, data);

    return res.json(entrega);
  }
}

export default new DeliveryProblemsController();
