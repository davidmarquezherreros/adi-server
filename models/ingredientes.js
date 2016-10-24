"use strict";

module.exports = function(sequelize, DataTypes) {
  var Ingrediente = sequelize.define("Ingrediente", {
    nombre: DataTypes.STRING,
    precio: DataTypes.INTEGER,
  },{
    name: {singular:'Ingrediente', plural: 'Ingrediente'},
    classMethods:{
      associate: function(models){
        Ingrediente.hasMany(models.Pedido);
        Ingrediente.hasMany(models.Receta);
      }
    }
  });

  return Ingrediente;
};
