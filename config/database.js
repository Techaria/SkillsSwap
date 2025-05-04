const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  'sql12776793', // your DB name
  'sql12776793', // your username
  'BRah1V7Eva', // your password
  {
    host: 'sql12.freesqldatabase.com', // your host
    port: 3306, // default MySQL port
    dialect: 'mysql',
  }
);

sequelize.authenticate()
  .then(() => console.log('Connected to MySQL (FreeSQLDatabase.com)'))
  .catch((err) => console.error('Connection error:', err));

module.exports = sequelize;

