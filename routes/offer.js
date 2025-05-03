const express = require('express');
const router = express.Router();
const db = require('../db'); // Assume MySQL connection is set up in db.js

// Show the Offer Skill form
router.get('/', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('offer-skill');
});

// Handle form submission
router.post('/', async (req, res) => {
  const { title, description, token_value } = req.body;
  const userId = req.session.user.id;

  if (!title || !description || !token_value) {
    return res.status(400).send('All fields are required.');
  }

  try {
    const insertQuery = `INSERT INTO skill_offers (user_id, title, description, token_value) VALUES (?, ?, ?, ?)`;
    await db.query(insertQuery, [userId, title, description, token_value]);
    res.redirect('/market');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;