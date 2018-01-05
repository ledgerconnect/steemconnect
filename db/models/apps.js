module.exports = (sequelize, DataTypes) => {
  return sequelize.define('apps', {
    client_id: DataTypes.STRING,
    secret: DataTypes.STRING,
    owner: DataTypes.STRING,
    redirect_uris: DataTypes.JSONB,
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    icon: DataTypes.TEXT,
    website: DataTypes.TEXT,
    beneficiaries: DataTypes.JSONB,
    is_approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    is_public: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
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
