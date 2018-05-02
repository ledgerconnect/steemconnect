module.exports = (sequelize, DataTypes) => sequelize.define('blacklisted_refresh_tokens',
  {
    client_id: DataTypes.STRING,
    user: DataTypes.STRING,
    token: DataTypes.TEXT,
  }, {
    freezeTableName: true,
    underscored: true,
    indexes: [
      { unique: true, fields: ['token'] },
    ],
  });
