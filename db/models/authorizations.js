module.exports = (sequelize, DataTypes) => {
  return sequelize.define('authorizations', {
    client_id: DataTypes.STRING,
    user: DataTypes.STRING,
    scope: DataTypes.TEXT,
  }, {
    freezeTableName: true,
    underscored: true,
    classMethods: {
      associate: (models) => {
        // associations can be defined here
      },
    },
  });
};
