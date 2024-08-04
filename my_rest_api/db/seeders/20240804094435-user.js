module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('user', [
      {
        firstName: 'Juan',
        lastName: 'Dela Cruz',
        email: 'example@example.com',
        password: '12345678',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('user', null, {});
  },
};