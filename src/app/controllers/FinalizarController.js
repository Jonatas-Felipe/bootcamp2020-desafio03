import * as yup from 'yup';
import { isBefore } from 'date-fns';
import Entrega from '../models/Entrega';

class FinalizarController {
  async store(req, res) {
    const schema = yup.object().shape({
      date: yup.number().required(),
      signature_id: yup.number().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação.' });
    }

    const entrega = await Entrega.findByPk(req.params.id_entrega);

    if (!entrega) {
      return res.status(400).json({ error: 'Entrega não encontrada.' });
    }

    const { canceled_at, start_date, end_date } = entrega;

    if (end_date) {
      return res.status(400).json({ error: 'Esta encomenda já foi entregue.' });
    }

    if (canceled_at) {
      return res
        .status(400)
        .json({ error: 'A entrega dessa encomeda foi cancelada.' });
    }

    const { date, signature_id } = req.body;

    const end_date_entrega = Number(date);

    if (isBefore(end_date_entrega, start_date)) {
      return res.status(400).json({
        error: 'Não é possivel entregar uma encomenda antes de sua retirada'
      });
    }

    await entrega.update({ end_date: end_date_entrega, signature_id });

    return res.json(entrega);
  }
}

export default new FinalizarController();
