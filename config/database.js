// config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mywebsite', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});

sequelize.authenticate()
    .then(() => {
        console.log('Connected to MySQL using Sequelize');
    })
    .catch((err) => {
        console.error('Error connecting to MySQL:', err);
    });

module.exports = sequelize;
