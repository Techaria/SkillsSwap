const express = require('express');
const session = require('express-session');
const app = express();
const sequelize = require('./config/database');
const UserController = require('./controllers/UserController');
const SkillController = require('./controllers/SkillController');
const TransactionController = require('./controllers/TransactionController');
const transactionRoutes = require('./routes/transactionRoutes');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/index'); // Or authRoutes.js if you create one


// Middleware
app.use(bodyParser.json());
app.use('/api', userRoutes); // Use API prefix for authentication routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}));

// Set up EJS as templating engine
app.set('view engine', 'ejs');

// Static files (for CSS and JavaScript)
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => res.render('home'));
app.get('/signup', (req, res) => res.render('signup'));
app.get('/login', (req, res) => res.render('login'));
app.post('/signup', UserController.register);
app.post('/login', UserController.login);
app.get('/dashboard', UserController.dashboard);

app.get('/offer', (req, res) => res.render('offer-skill'));
app.post('/offer', SkillController.offerSkill);

app.get('/request', (req, res) => res.render('request-help'));
app.post('/request', SkillController.requestHelp);

app.get('/market', SkillController.viewMarket);

app.use('/transactions', transactionRoutes);
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});


// Sync database
sequelize.sync()  // This syncs the models with the database (creating tables if not already present)
  .then(() => console.log('Database synced'))
  .catch(err => console.error('Error syncing database:', err));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
