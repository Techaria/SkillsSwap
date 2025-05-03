const { Skill, User } = require('../models');


// Offer a Skill
exports.offerSkill = async (req, res) => {
  const { title, description, token_value } = req.body;
  const user = req.session.user;
if (!user) {
  return res.redirect('/login'); // Or send an error
}
if (!token_value) {
  return res.status(400).send("Token value is required");
}


  try {
    // Create new skill offer in the database
    const newSkill = await Skill.create({
      title,
      description,
      token_value,
      userId: user.id, // Link skill offer to user
    });

    res.redirect('/market'); // Redirect to market after offering a skill
  } catch (error) {
    console.error(error);
    res.status(500).send('Error offering skill');
  }
};

// Request Help
exports.requestHelp = async (req, res) => {
  const { title, description, token_value } = req.body;
  const user = req.session.user;
if (!user) {
  return res.redirect('/login'); // Or send an error
}


  try {
    // Create new help request in the database
    const newRequest = await Skill.create({
      title,
      description,
      token_value, // Offer tokens in exchange for help
      userId: user.id,
    });

    res.redirect('/market'); // Redirect to market after requesting help
  } catch (error) {
    console.error(error);
    res.status(500).send('Error requesting help');
  }
};

// View Market (Skill Offers)
exports.viewMarket = async (req, res) => {
  const { title, minTokens, maxTokens } = req.query;
  const where = {};

  if (title) where.title = { [Op.like]: `%${title}%` };
  if (minTokens) where.token_value = { ...where.token_value, [Op.gte]: +minTokens };
  if (maxTokens) where.token_value = { ...where.token_value, [Op.lte]: +maxTokens };

  try {
    const skills = await Skill.findAll({
      where,
      include: [{ model: User }]
    });
    res.render('market', { skills, user: req.session.user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching market data');
  }
};
