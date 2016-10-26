"use strict";

module.exports = function(sequelize, DataTypes) {
  var Usuario = sequelize.define("Usuario", {
    nombre: DataTypes.STRING,
    apellidos: DataTypes.STRING
  }, {
    name: {singular: 'Usuario', plural: 'Usuarios'},
    classMethods: {
      associate: function(models){
        Usuario.hasMany(models.Pedido);
      }
    }
  });

  return Usuario;
};
