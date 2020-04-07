import Sequelize, { Model } from 'sequelize';

class DeliveryProblems extends Model {
  static init(sequelize) {
    super.init(
      {
        description: Sequelize.STRING
      },
      {
        sequelize
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Entrega, {
      foreignKey: 'delivery_id',
      as: 'entrega'
    });
  }
}

export default DeliveryProblems;
