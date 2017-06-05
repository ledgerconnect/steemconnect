module.exports = (sequelize, DataTypes) => {
  return sequelize.define('tokens', {
    client_id: DataTypes.STRING,
    user: DataTypes.STRING,
    token: DataTypes.TEXT,
  }, {
    freezeTableName: true,
    underscored: true,
    classMethods: {
      associate: (models) => {
        // associations can be defined here
      }
    }
  });
};
