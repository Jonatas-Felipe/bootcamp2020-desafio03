import * as yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = yup.object().shape({
      recipient_name: yup.string().required(),
      street: yup.string().required(),
      number: yup.number().required(),
      state: yup.string().required(),
      zipcode: yup.string().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação.' });
    }

    const {
      recipient_name,
      street,
      number,
      state,
      zipcode
    } = await Recipient.create(req.body);

    return res.json({ recipient_name, street, number, state, zipcode });
  }

  async update(req, res) {
    const schema = yup.object().shape({
      recipient_name: yup.string(),
      street: yup.string(),
      number: yup.number(),
      state: yup.string(),
      zipcode: yup.string()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação.' });
    }

    const recipient = await Recipient.findByPk(req.params.id);

    const {
      recipient_name,
      street,
      number,
      state,
      zipcode
    } = await recipient.update(req.body);

    return res.json({ recipient_name, street, number, state, zipcode });
  }
}

export default new RecipientController();
