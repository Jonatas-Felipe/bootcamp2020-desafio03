import { Op } from 'sequelize';
import Entrega from '../models/Entrega';
import Recipient from '../models/Recipient';

class DeliverymanEntregaController {
  async index(req, res) {
    const [, , , view_orders] = req.originalUrl.split('/');
    const deliveryman_id = req.params.id_delivery;

    let entregas;

    if (view_orders === 'deliveries') {
      entregas = await Entrega.findAll({
        where: {
          deliveryman_id,
          canceled_at: null,
          end_date: null
        }
      });
    } else {
      entregas = await Entrega.findAll({
        where: {
          deliveryman_id,
          [Op.not]: { end_date: null }
        }
      });
    }

    return res.json(entregas);
  }

  async show(req, res) {
    const { deliveryman_id } = req.params;
    const { status, page } = req.query;

    let where;

    if (status === 'Entregue') {
      where = {
        deliveryman_id,
        canceled_at: null,
        [Op.not]: { end_date: null }
      };
    } else {
      where = { deliveryman_id, canceled_at: null, end_date: null };
    }

    const entregas = await Entrega.findAll({
      where,
      offset: (page - 1) * 5,
      limit: 5,
      attributes: ['id', 'product', 'start_date', 'end_date', 'created_at'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'recipient_name',
            'street',
            'number',
            'complement',
            'city',
            'zipcode',
            'state'
          ]
        }
      ]
    });

    return res.json(entregas);
  }
}

export default new DeliverymanEntregaController();
