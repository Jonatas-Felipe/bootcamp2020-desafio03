import * as yup from 'yup';
import { Op } from 'sequelize';
import Recipient from '../models/Recipient';

class RecipientController {
  async index(req, res) {
    const { recipient_name, page } = req.query;

    let where;
    let offset;
    let limit;

    if (recipient_name) {
      where = { recipient_name: { [Op.like]: `%${recipient_name}%` } };
    }

    if (page) {
      offset = (page - 1) * 4;
      limit = 4;
    }

    const recipients = await Recipient.findAll({
      where,
      offset,
      limit,
      attributes: [
        'id',
        'recipient_name',
        'street',
        'number',
        'complement',
        'city',
        'state',
        'zipcode'
      ]
    });

    const total = await Recipient.count({ where });

    const pages = Math.ceil(total / 4);

    const data = [{ data: recipients }, { pages }];

    return res.json(data);
  }

  async store(req, res) {
    const schema = yup.object().shape({
      recipient_name: yup.string().required(),
      street: yup.string().required(),
      number: yup.string().required(),
      city: yup.string().required(),
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
      city,
      state,
      zipcode
    } = await Recipient.create(req.body);

    return res.json({ recipient_name, street, number, city, state, zipcode });
  }

  async show(req, res) {
    const { id } = req.params;

    const recipient = await Recipient.findOne({
      where: { id },
      attributes: [
        'id',
        'recipient_name',
        'street',
        'number',
        'complement',
        'city',
        'state',
        'zipcode'
      ]
    });

    if (!recipient) {
      return res.status(400).json({ error: 'Destinatário não encontrado.' });
    }

    return res.json(recipient);
  }

  async update(req, res) {
    const schema = yup.object().shape({
      recipient_name: yup.string(),
      street: yup.string(),
      number: yup.number(),
      city: yup.string(),
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
      city,
      state,
      zipcode
    } = await recipient.update(req.body);

    return res.json({ recipient_name, street, number, city, state, zipcode });
  }

  async delete(req, res) {
    const recipient = await Recipient.findByPk(req.params.id);

    if (!recipient) {
      return res.status(400).json({ error: 'Destinatário não encontrado.' });
    }

    recipient.destroy();

    return res.json();
  }
}

export default new RecipientController();
