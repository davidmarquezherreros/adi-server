"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: DataTypes.STRING,
    nombre: DataTypes.STRING,
    apellidos: DataTypes.STRING
  }, {
    name: {singular: 'User', plural: 'Users'},
    classMethods: {
      associate: function(models){
        User.hasMany(models.Pedido);
      }
    }
  });

  return User;
};
