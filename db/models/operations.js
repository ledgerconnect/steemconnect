module.exports = (sequelize, DataTypes) => {
  return sequelize.define('operations', {
    client_id: DataTypes.STRING,
    user: DataTypes.STRING,
    token: DataTypes.TEXT,
    operation_type: DataTypes.TEXT,
    operation_payload: DataTypes.JSONB,
    tx_id: DataTypes.TEXT,
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
