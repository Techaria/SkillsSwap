module.exports = (sequelize, DataTypes) => {
  const Skill = sequelize.define('skill', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    token_value: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Skill.associate = (models) => {
    Skill.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Skill;
};
