'use strict';
module.exports = function(sequelize, DataTypes) {
  var App = sequelize.define('App', {
    client_id: DataTypes.STRING,
    secret: DataTypes.STRING,
    owner: DataTypes.STRING,
    redirect_uris: DataTypes.JSONB,
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    icon: DataTypes.TEXT,
    website: DataTypes.TEXT
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return App;
};
