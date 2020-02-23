module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('users', 'password_hash', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('users', 'password_hash', {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};
