"use strict";

module.exports = function(sequelize, DataTypes) {
  var Pedido = sequelize.define("Pedido", {
    Cantidad: DataTypes.INTEGER,
    Precio: DataTypes.FLOAT,
  },{
    name: {singular:'Pedido', plural: 'Pedidos'},
    classMethods:{
      associate: function(models){
        Pedido.belongsTo(models.Usuario);
        Pedido.belongsToMany(models.Ingrediente, {through: 'IngredientesPedido'});
      }
    }
  });

  return Pedido;
};
