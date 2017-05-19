module.exports = (sequelize, DataTypes) => {
  return sequelize.define('apps', {
    client_id: DataTypes.STRING,
    secret: DataTypes.STRING,
    owner: DataTypes.STRING,
    redirect_uris: DataTypes.JSONB,
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    icon: DataTypes.TEXT,
    website: DataTypes.TEXT
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
