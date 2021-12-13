'use strict';
module.exports = (sequelize, DataTypes) => {
  const List = sequelize.define('List', {
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {model: "Users"}
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING(50)
    },
    isFavorite: {
      defaultValue: false,
      type: DataTypes.BOOLEAN
    },
  }, {});
  List.associate = function(models) {
    // associations can be defined here
  };
  return List;
};
