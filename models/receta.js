"use strict";

module.exports = function(sequelize, DataTypes) {
  var Receta = sequelize.define("Receta", {
    nombre: DataTypes.STRING,
    descripcion: DataTypes.STRING,
    dificultad: DataTypes.INTEGER,
  }, {
    name: {singular: 'Receta', plural: 'Recetas'},
    classMethods: {
      associate: function(models){
        Receta.hasMany(models.Comentario);
        Receta.belongsTo(models.Categoria);
        Receta.belongsToMany(models.Ingrediente, {through: 'IngredientesReceta'});
      }
    }
  });
  return Receta;
};
