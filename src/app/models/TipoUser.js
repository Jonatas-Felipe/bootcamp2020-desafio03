import Sequelize, { Model } from 'sequelize';

class TipoUser extends Model {
  static init(sequelize) {
    super.init(
      {
        tipo_user: Sequelize.STRING
      },
      {
        sequelize
      }
    );

    return this;
  }
}

export default TipoUser;
