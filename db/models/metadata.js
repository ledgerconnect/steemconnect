module.exports = (sequelize, DataTypes) => sequelize.define('metadata',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    client_id: DataTypes.STRING,
    user: DataTypes.STRING,
    user_metadata: DataTypes.TEXT,
    created_at: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
  },
  {
    freezeTableName: true,
    underscored: true,
    indexes: [
        { unique: true, fields: ['client_id', 'user'] },
    ],
    uniqueKeys: {
      metadata_client_id_user_key: {
        fields: ['client_id', 'user'],
      },
    },
  });
