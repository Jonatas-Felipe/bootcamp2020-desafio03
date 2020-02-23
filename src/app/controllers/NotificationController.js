import User from '../models/User';
import Notifications from '../schemas/Notifications';

class NotificationController {
  async index(req, res) {
    const id = req.params.user_id;

    const checkEntregador = await User.findOne({
      where: { id, tipo_user_id: 2 }
    });

    if (!checkEntregador) {
      return res.status(401).json({
        error: 'Somente entregadores podem ler notificações.'
      });
    }

    const notifications = await Notifications.find({
      user: id
    })
      .sort({ createdAt: 'desc' })
      .limit(20);
    return res.json(notifications);
  }

  async update(req, res) {
    const notification = await Notifications.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    return res.json(notification);
  }
}

export default new NotificationController();
