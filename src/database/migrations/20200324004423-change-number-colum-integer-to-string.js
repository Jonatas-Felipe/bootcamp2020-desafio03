module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('recipients', 'number', {
      type: Sequelize.STRING,
      allowNull: false
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('recipients', 'number', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
  }
};
