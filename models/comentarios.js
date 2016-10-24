"use strict";

module.exports = function(sequelize, DataTypes) {
  var Comentario = sequelize.define("Comentario", {
    mensaje: DataTypes.STRING,
  },{
    name: {singular:'Comentario', plural: 'Comentarios'},
    classMethods:{
      associate: function(models){
        Comentario.belongsTo(models.Receta);
      }
    }
  });
  return Comentario;
};
