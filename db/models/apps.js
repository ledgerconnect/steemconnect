module.exports = (sequelize, DataTypes) => sequelize.define('apps',
  {
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
    is_disabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    allowed_ips: DataTypes.JSONB,
  },
  {
    freezeTableName: true,
    underscored: true,
    indexes: [
        { unique: true, fields: ['client_id'] },
        { unique: true, fields: ['client_id', 'secret'] },
        { unique: true, fields: ['client_id', 'redirect_uris'] },
    ],
  });
