const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Assuming User model exists
const UserController = require('../controllers/UserController');
const SkillController = require('../controllers/SkillController');
const TransactionController = require('../controllers/TransactionController');


// Home route
router.get('/', (req, res) => {
  res.render('home');
});

// User registration route
router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', UserController.register);

// Login route
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', UserController.login);

// Signup Route
router.post('/signup', async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      // Validate fields
      if (!username || !email || !password) {
        return res.status(400).json({ msg: 'Please fill in all fields' });
      }
  
      // Check if user exists
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ msg: 'User already exists' });
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create user
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
      });
  
      // Generate JWT
      const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.status(201).json({ token, user: { id: newUser.id, username: newUser.username, email: newUser.email } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Server error' });
    }
  });
  
  // Login Route
  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Validate fields
      if (!email || !password) {
        return res.status(400).json({ msg: 'Please fill in all fields' });
      }
  
      // Check if user exists
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
  
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
  
      // Generate JWT
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Server error' });
    }
  });

// Dashboard route
router.get('/dashboard', UserController.dashboard);

// Offer Skill route
router.get('/offer', (req, res) => {
  res.render('offer-skill');
});

router.post('/offer', SkillController.offerSkill);

// Request Help route
router.get('/request', (req, res) => {
  res.render('request-help');
});

router.post('/request', SkillController.requestHelp);

// Market route
router.get('/market', SkillController.viewMarket);

// Transactions route
router.get('/transactions', TransactionController.viewTransactions);

// Request Help page
router.get('/request', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    res.render('request-help');
});

// Request Help logic
router.post('/request', (req, res) => {
    const { title, description, token_offer } = req.body;
    const userId = req.session.userId;

    // Insert the request into the database
    db.query('INSERT INTO requests (user_id, title, description, token_offer) VALUES (?, ?, ?, ?)', 
        [userId, title, description, token_offer], (err, result) => {
        if (err) {
            return res.send('Error: ' + err);
        }
        res.redirect('/dashboard');
    });
});

// Skill Marketplace page
router.get('/market', (req, res) => {
    db.query('SELECT * FROM skills', (err, skills) => {
        if (err) {
            return res.send('Error fetching skills: ' + err);
        }
        res.render('market', { skills });
    });
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

module.exports = router;