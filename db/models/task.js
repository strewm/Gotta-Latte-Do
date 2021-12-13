'use strict';
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {model: 'Users'}
    },
    description: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    isCompleted: {
      defaultValue: false,
      type: DataTypes.BOOLEAN
    },
    dueDate: {
      type: DataTypes.DATE
    },
    givenTo: {
      defaultValue: null,
      type: DataTypes.INTEGER,
      references: {model: 'Users'}
    },
  }, {});
  Task.associate = function(models) {
    // associations can be defined here
  };
  return Task;
};
