module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('recipients', 'city', {
      type: Sequelize.STRING,
      allowNull: false,
      after: 'complement'
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('recipients', 'city');
  }
};
