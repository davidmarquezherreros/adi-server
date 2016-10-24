"use strict";

module.exports = function(sequelize, DataTypes) {
  var Pedido = sequelize.define("Pedido", {
    Cantidad: DataTypes.INTEGER,
    Precio: DataTypes.FLOAT,
  },{
    name: {singular:'Pedido', plural: 'Pedidos'},
    classMethods:{
      associate: function(models){
        Pedido.belongsTo(models.User);
        Pedido.hasMany(models.Ingrediente);
      }
    }
  });

  return Pedido;
};
