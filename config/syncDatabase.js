const sequelize = require('./config/database');
const User = require('./models/User');
const Skill = require('./models/Skill');
const Transaction = require('./models/Transaction');

async function syncDatabase() {
  try {
    // Sync all models
    await sequelize.sync({ force: false }); // Set `force: true` for reset on every start
    console.log('Database synced successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
}

syncDatabase();
