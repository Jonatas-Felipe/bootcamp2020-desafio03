import * as yup from 'yup';
import Entrega from '../models/Entrega';
import User from '../models/User';
import Notifications from '../schemas/Notifications';
import EntregaMail from '../jobs/EntregaMail';
import Queue from '../../lib/Queue';

class EntregaController {
  async index(req, res) {
    const entregas = await Entrega.findAll();
    return res.json(entregas);
  }

  async store(req, res) {
    const schema = yup.object().shape({
      recipient_id: yup.number().required(),
      deliveryman_id: yup.number().required(),
      product: yup.string().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação.' });
    }

    const { recipient_id, deliveryman_id } = req.body;

    const check_entrega = await Entrega.findOne({ where: { recipient_id } });

    if (check_entrega) {
      return res.status(400).json({ error: 'Esta entrega já foi cadastrada.' });
    }

    const user = await User.findOne({
      where: { id: deliveryman_id, tipo_user_id: 2 }
    });

    if (!user) {
      return res.status(401).json({
        error: 'Um entrega só pode ser cadastradas para entregadores.'
      });
    }

    const { id, product, start_date } = await Entrega.create(req.body);
    const { name, email } = await User.findByPk(deliveryman_id);

    const data = { name, email, product };

    await Queue.add(EntregaMail.key, data);

    return res.json({ id, recipient_id, deliveryman_id, product, start_date });
  }

  async show(req, res) {
    const entrega = await Entrega.findByPk(req.params.id);
    if (!entrega) {
      return res.status(400).json({ error: 'Entrega não encontrada.' });
    }

    return res.json(entrega);
  }

  async update(req, res) {
    const schema = yup.object().shape({
      recipient_id: yup.number(),
      deliveryman_id: yup.number().required(),
      product: yup.string()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação.' });
    }

    const entrega = await Entrega.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'deliveryman',
          attributes: ['id', 'name']
        }
      ]
    });

    if (!entrega) {
      return res.status(400).json({ error: 'Entrega não encontrada.' });
    }
    const { deliveryman_id } = req.body;
    const { id, name } = entrega.deliveryman;

    const user = await User.findOne({
      where: { id: deliveryman_id, tipo_user_id: 2 }
    });

    if (!user) {
      return res.status(401).json({
        error: 'Um entrega só pode ser cadastradas para entregadores.'
      });
    }

    await entrega.update(req.body);

    const updatedEntrega = await Entrega.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'deliveryman',
          attributes: ['id', 'name']
        }
      ]
    });

    if (deliveryman_id !== id) {
      await Notifications.create({
        content: `Olá ${name}, o entregador da encomenda ${updatedEntrega.product} foi mudado.`,
        user: id
      });

      await Notifications.create({
        content: `Olá ${updatedEntrega.deliveryman.name}, você agora é o novo entregador da entrega ${updatedEntrega.product}.`,
        user: updatedEntrega.deliveryman.id
      });
    }

    return res.json(updatedEntrega);
  }

  async delete(req, res) {
    const entrega = await Entrega.findByPk(req.params.id);
    if (!entrega) {
      return res.status(400).json({ error: 'Entrega não encontrada.' });
    }

    entrega.destroy();

    return res.json();
  }
}

export default new EntregaController();
