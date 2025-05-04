const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false, // optional: turn off SQL logs
  }
);

sequelize.authenticate()
  .then(() => {
    console.log('✅ Connected to MySQL using Sequelize');
  })
  .catch((err) => {
    console.error('❌ Error connecting to MySQL:', err);
  });

module.exports = sequelize;
