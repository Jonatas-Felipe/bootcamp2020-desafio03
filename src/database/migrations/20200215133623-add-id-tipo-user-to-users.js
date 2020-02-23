module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'tipo_user_id', {
      type: Sequelize.INTEGER,
      references: { model: 'tipo_user', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      defaultValue: 2,
      allowNull: true
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'tipo_user_id');
  }
};
