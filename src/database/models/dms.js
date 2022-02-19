'use strict';
module.exports = (sequelize, DataTypes) => {
  const dms = sequelize.define('dms', {
    creatorId: {
      type: DataTypes.STRING,
      references: { model: 'users', key: 'id' },
      allowNull: false,
    },
    senderId: {
      type: DataTypes.STRING,
      references: { model: 'users', key: 'id' },
      allowNull: false,
    },
    receiverId: {
      type: DataTypes.STRING,
      references: { model: 'users', key: 'id' },
      allowNull: false
    },
    message: DataTypes.TEXT,
    readAt: DataTypes.DATE
  }, {});
  dms.associate = ({ users })  => {
    dms.belongsTo(users, { foreignKey: 'receiverId', targetKey: 'id', as: 'sentDms' });
    dms.belongsTo(users, { foreignKey: 'senderId', targetKey: 'id', as: 'receivedDms' });
    dms.belongsTo(users, { foreignKey: 'senderId',foreignKey: 'receiverId', targetKey: 'id', as: 'chat' });
  };
  return dms;
};
