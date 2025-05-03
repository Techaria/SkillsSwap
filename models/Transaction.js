module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('transaction', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tokens: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Transaction.associate = (models) => {
    Transaction.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Transaction;
};
