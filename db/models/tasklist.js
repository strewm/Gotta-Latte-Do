'use strict';
module.exports = (sequelize, DataTypes) => {
  const TaskList = sequelize.define('TaskList', {
    taskId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {model: 'Tasks'}

    },
    listId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {model: 'Lists'}
    },
  }, {});
  TaskList.associate = function(models) {
    // associations can be defined here
    
  };
  return TaskList;
};
