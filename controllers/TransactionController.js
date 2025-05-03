const Skill = require('../models/Skill');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

// Handle Skill Exchange (Transaction)
exports.handleTransaction = async (req, res) => {
  const { skillId, userId } = req.body; // Get the skill ID and the user ID of the other participant
  const user = req.session.user; // Logged-in user

  try {
    // Find the skill being exchanged
    const skill = await Skill.findByPk(skillId);
    if (!skill) {
      return res.status(400).send('Skill not found');
    }

    // Check if the logged-in user has enough tokens to make the exchange
    if (user.tokens < skill.token_value) {
      return res.status(400).send('Not enough tokens');
    }

    // Deduct tokens from the user offering the skill
    await User.update(
      { tokens: user.tokens - skill.token_value },
      { where: { id: user.id } }
    );

    // Add tokens to the user receiving the skill (the skill offerer)
    await User.update(
      { tokens: skill.token_value + skill.userId.tokens },
      { where: { id: skill.userId } }
    );

    // Create a transaction record for both users
    await Transaction.create({
      type: 'Skill Exchange',
      description: `Exchanged skill: ${skill.title}`,
      tokens: skill.token_value,
      userId: user.id,
    });

    await Transaction.create({
      type: 'Skill Exchange',
      description: `Exchanged skill: ${skill.title}`,
      tokens: skill.token_value,
      userId: skill.userId,
    });

    res.redirect('/transactions'); // Redirect to transaction history page
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing transaction');
  }
};
exports.viewTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { userId: req.session.user.id },
      order: [['createdAt', 'DESC']],
    });
    res.render('transactions', { transactions });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving transactions');
  }
};
