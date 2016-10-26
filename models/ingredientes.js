"use strict";

module.exports = function(sequelize, DataTypes) {
  var Ingrediente = sequelize.define("Ingrediente", {
    nombre: DataTypes.STRING,
    precio: DataTypes.INTEGER,
  },{
    name: {singular:'Ingrediente', plural: 'Ingrediente'},
    classMethods:{
      associate: function(models){
        Ingrediente.belongsToMany(models.Pedido, {through: 'IngredientesPedido'})
      }
    }
  });

  return Ingrediente;
};
