import * as yup from 'yup';
import { Op } from 'sequelize';
import {
  format,
  setHours,
  setMinutes,
  setSeconds,
  isBefore,
  isAfter
} from 'date-fns';
import Entrega from '../models/Entrega';
import User from '../models/User';

class RetiradaController {
  async store(req, res) {
    const schema = yup.object().shape({
      deliveryman_id: yup.number().required(),
      date: yup.number().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação.' });
    }

    const entrega = await Entrega.findOne({
      where: {
        id: req.params.id_entrega,
        deliveryman_id: req.body.deliveryman_id
      },
      include: [
        {
          model: User,
          as: 'deliveryman',
          where: {
            tipo_user_id: 2
          }
        }
      ]
    });

    if (!entrega) {
      return res.status(400).json({ error: 'Entrega não encontrada.' });
    }

    const { deliveryman_id, canceled_at, start_date, end_date } = entrega;

    if (end_date) {
      return res.status(400).json({ error: 'Esta encomenda já foi entregue.' });
    }

    if (start_date && !canceled_at) {
      return res
        .status(400)
        .json({ error: 'Esta encomenda já esta em rota de entrega.' });
    }

    const { date } = req.body;

    const start_date_entrega = Number(date);

    const date_start = setSeconds(
      setMinutes(setHours(start_date_entrega, '08'), '00'),
      '00'
    );
    const date_end = setSeconds(
      setMinutes(setHours(start_date_entrega, '23'), '00'),
      '00'
    );

    if (
      isBefore(start_date_entrega, date_start) ||
      isAfter(start_date_entrega, date_end)
    ) {
      return res.status(400).json({
        error: 'Uma entrega só pode ser retirada entre as 08:00 e 18:00'
      });
    }

    const dateFormatted = format(start_date_entrega, 'yyyy-MM-dd');

    const entregasDelivery = await Entrega.count({
      where: {
        deliveryman_id,
        start_date: {
          [Op.between]: [
            `${dateFormatted} 00:00:00`,
            `${dateFormatted} 23:59:59`
          ]
        }
      }
    });

    if (entregasDelivery > 5) {
      return res
        .status(400)
        .json({ erro: 'Um entregador só poder fazer 5 retiradas por dia.' });
    }

    await entrega.update({ start_date: start_date_entrega, canceled_at: null });

    return res.json(entrega);
  }
}

export default new RetiradaController();
