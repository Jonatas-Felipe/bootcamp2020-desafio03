module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'tipo_user',
      [
        {
          tipo_user: 'Administrador',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          tipo_user: 'Entregador',
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      {}
    );
  },

  down: (QueryInterface, Sequelize) => {
    const { Op } = Sequelize;
    return QueryInterface.bulkDelete(
      'tipo_user',
      { id: { [Op.in]: [1, 2] } },
      {}
    );
  }
};
