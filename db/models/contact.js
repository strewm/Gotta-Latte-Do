'use strict';
module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define('Contact', {
    userId: {
      type: DataTypes.INTEGER,
      references: {model: 'Users'}
    },
    contactId: {
      type: DataTypes.INTEGER,
      references: {model: 'Users'}
    },
  }, {});
  Contact.associate = function(models) {
    // associations can be defined here
  };
  return Contact;
};
