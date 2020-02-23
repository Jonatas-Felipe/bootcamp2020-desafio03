import * as yup from 'yup';
import User from '../models/User';

class DeliverymanController {
  async index(req, res) {
    const users = await User.findAll({ where: { tipo_user_id: 2 } });

    return res.json(users);
  }

  async store(req, res) {
    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup
        .string()
        .email()
        .required(),
      avatar_id: yup.number(),
      tipo_user_id: yup.number().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação.' });
    }

    if (req.body.tipo_user_id !== 2) {
      return res
        .status(400)
        .json({ error: 'O entregador não pode ser um administrador.' });
    }

    const user = await User.create(req.body);

    return res.json(user);
  }

  async show(req, res) {
    const user = await User.findOne({
      where: { id: req.params.id, tipo_user_id: 2 }
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
