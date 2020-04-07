import * as yup from 'yup';
import { Op } from 'sequelize';
import User from '../models/User';
import File from '../models/File';

class DeliverymanController {
  async index(req, res) {
    const { name, page } = req.query;

    let where;
    let offset;
    let limit;

    if (name) {
      where = { tipo_user_id: 2, name: { [Op.like]: `%${name}%` } };
    } else {
      where = { tipo_user_id: 2 };
    }

    if (page) {
      offset = (page - 1) * 4;
      limit = 4;
    }

    const users = await User.findAll({
      offset,
      limit,
      where,
      attributes: ['id', 'name', 'email'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url']
        }
      ]
    });

    const total = await User.count({
      where,
      include: [
        {
          model: File,
          as: 'avatar'
        }
      ]
    });

    const pages = Math.ceil(total / 4);

    const data = [{ data: users }, { pages }];

    return res.json(data);
  }

  async store(req, res) {
    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup
        .string()
        .email()
        .required(),
      avatar_id: yup.number(),
      tipo_user_id: yup.number()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação.' });
    }

    if (req.body.tipo_user_id && req.body.tipo_user_id !== 2) {
      return res
        .status(400)
        .json({ error: 'O entregador não pode ser um administrador.' });
    }

    const user = await User.create(req.body);

    return res.json(user);
  }

  async show(req, res) {
    const user = await User.findOne({
      where: { id: req.params.id, tipo_user_id: 2 },
      attributes: ['id', 'name', 'email', 'createdAt', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url']
        }
      ]
    });

    if (!user) {
      return res.status(400).json({ error: 'Usuário não encontrado.' });
    }

    return res.json(user);
  }

  async update(req, res) {
    const schema = yup.object().shape({
      name: yup.string(),
      email: yup.string().email(),
      avatar_id: yup.number()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação.' });
    }

    const user = await User.findOne({
      where: { id: req.params.id, tipo_user_id: 2 }
    });

    if (!user) {
      return res.status(400).json({ error: 'Usuário não encontrado.' });
    }

    await user.update(req.body);

    return res.json(user);
  }

  async delete(req, res) {
    const user = await User.findOne({
      where: { id: req.params.id, tipo_user_id: 2 }
    });

    if (!user) {
      return res.status(400).json({ error: 'Usuário não encontrado.' });
    }

    await user.destroy();

    return res.json();
  }
}

export default new DeliverymanController();
