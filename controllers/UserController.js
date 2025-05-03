const bcrypt = require('bcrypt');
const { sequelize } = require('../config/database');  // Or wherever you initialize sequelize
const User = require('../models/User');


// Register User
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).send('User already exists');
    }

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password,
      tokens: 100, // Set initial token balance
    });

    res.redirect('/login'); // Redirect to login page after successful registration
  } catch (error) {
    console.error(error);
    res.status(500).send('Error registering user');
  }
};

// Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).send('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid credentials');
    }

    // Store user data in session or JWT token for persistent login
    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
    };
    
    res.redirect('/dashboard'); // Redirect to dashboard after successful login
  } catch (error) {
    console.error(error);
    res.status(500).send('Error logging in user');
  }
};

// Display Dashboard
exports.dashboard = async (req, res) => {
  try {
    const user = req.session.user; // Fetch logged-in user from session
    if (!user) {
      return res.redirect('/login'); // Redirect to login if not logged in
    }

    res.render('dashboard', { user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching dashboard data');
  }
};
