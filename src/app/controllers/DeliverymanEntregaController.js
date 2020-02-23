import { Op } from 'sequelize';
import Entrega from '../models/Entrega';

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
}

export default new DeliverymanEntregaController();
