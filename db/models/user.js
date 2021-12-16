'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING
    },
    username: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING(50)
    },
    hashedPassword: {
      allowNull: false,
      type: DataTypes.STRING.BINARY
    },
  },{});
  User.associate = function(models) {
    // associations can be defined here
    User.belongsToMany(models.User, {foreignKey: 'userId', through: 'Contact', otherKey: 'contactId', as: 'contacts'})
    User.belongsToMany(models.User, {foreignKey: 'contactId', through: 'Contact', otherKey: 'userId', as: 'contactees'})
    User.hasMany(models.Comment, {foreignKey: 'userId', onDelete: 'CASCADE', hooks: true});
    User.hasMany(models.Task, {foreignKey: 'userId', onDelete: 'CASCADE', hooks: true});
    User.hasMany(models.Task, {foreignKey: 'givenTo', onDelete: 'CASCADE', hooks: true});
    User.hasMany(models.List, {foreignKey: 'userId', onDelete: 'CASCADE', hooks: true});
  };
  return User;
};
