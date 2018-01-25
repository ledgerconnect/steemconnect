module.exports = (sequelize, DataTypes) => {
  return sequelize.define('metadata', {
    client_id: DataTypes.STRING,
    user: DataTypes.STRING,
    user_metadata: DataTypes.TEXT,
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
