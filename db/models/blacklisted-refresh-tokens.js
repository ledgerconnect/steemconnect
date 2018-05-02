module.exports = (sequelize, DataTypes) => sequelize.define('blacklisted_refresh_tokens',
  {
    token: {
      type: DataTypes.TEXT,
      primaryKey: true,
    },
    client_id: DataTypes.STRING,
    user: DataTypes.STRING,
  }, {
    freezeTableName: true,
    underscored: true,
    indexes: [
      { unique: true, fields: ['token'] },
    ],
  });
