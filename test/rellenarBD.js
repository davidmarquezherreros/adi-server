/**
 * Module dependencies.
 */
var app = require('../app');
var debug = require('debug')('.bin:server');
var http = require('http');
var models = require("../models");

app.set('port', process.env.PORT || 3000);
exports.rellenarBD = function() {
	return models.sequelize.sync({force:true}).then(function () {
		return models.Categoria.bulkCreate([
			{id: 1, nombre:'Carnes'},
			{id: 2, nombre:'Pescados'},
			{id: 3, nombre:'Pastas'},
			{id: 4, nombre:'Tapas'}
		]).then(function() {
				return models.Usuario.bulkCreate([
					{id: 1, nombre:'Lucas',apellidos: 'Api', email: 'lucas.api@email.com'},
					{id: 2, nombre:'Ana',apellidos: 'Api', email: 'ana.api@email.com'},
					{id: 3, nombre:'Juan', apellidos:'Api',email: 'juan.api@email.com'},
					{id: 4, nombre:'Pedro', apellidos:'Api',email: 'pedro.api@email.com'},
					{id: 5, nombre:'Miguel', apellidos:'Api',email: 'miguel.api@email.com'},
					{id: 6, nombre:'Antonio', apellidos:'Api',email: 'antonio.api@email.com'},
					{id: 7, nombre:'Pablo', apellidos:'Api',email: 'pablo.api@email.com'},
					{id: 8, nombre:'Susan', apellidos:'Api',email: 'susan.api@email.com'},
					{id: 9, nombre:'Rosario', apellidos:'Api',email: 'rosario.api@email.com'},
					{id: 10, nombre:'Nestor', apellidos:'Api',email: 'nestor.api@email.com'},
					{id: 11, nombre:'Jose', apellidos:'Api',email: 'jose.api@email.com'},
					{id: 12, nombre:'Carlos', apellidos:'Api',email: 'juan.api@email.com'}
				]).then(function() {
						return models.Ingrediente.bulkCreate([
						{id: 1, nombre: 'Aceite de oliva', precio: 3},
	          {id: 2, nombre: 'Aceite de girasol', precio: 2},
	          {id: 3, nombre: 'Ternera', precio: 12},
	          {id: 4, nombre: 'Salmon', precio: 7},
	          {id: 5, nombre: 'Cerdo', precio: 5},
	          {id: 6, nombre: 'Parmesano', precio: 16},
	          {id: 7, nombre: 'Harina', precio: 1},
	          {id: 8, nombre: 'Sal', precio: 1},
	          {id: 9, nombre: 'Agua', precio: 1},
	          {id: 10, nombre: 'Pimienta', precio: 1},
	        ]).then(function(){
	          return models.Receta.bulkCreate([
	            {id: 1, nombre: 'Ternera con parmesano', descripcion:'Cocinas la carne y le pones parmesano',dificultad: 1, CategoriaId: 1},
	            {id: 2, nombre: 'Ternera con sal', descripcion:'Cocinas la carne y le pones sal',dificultad: 1, CategoriaId: 1},
	            {id: 3, nombre: 'Salmon con salsa de parmesano', descripcion:'Cocinas el salmon con salsa de parmesano',dificultad: 3, CategoriaId: 2},
							{id: 5, nombre: 'Pan con aceite', descripcion:'Tostamos el pan y le ponemos aceite',dificultad: 1, CategoriaId: 4},
							{id: 6, nombre: 'Cerdo frito con pan', descripcion:'Cocinamos el cerdo y le ponemos pan',dificultad: 1, CategoriaId: 1}
	          ]).then(function(){
							return models.Receta.create({id: 4, nombre: 'Ternera con salmon', descripcion:'Cocinas la ternera y el salmon a la vez', dificultad: 1, CategoriaId: 1}
						).then(function(receta){
							return models.Ingrediente.create({id: 11, nombre: 'jamon serrano', precio: 20}).then(function(ingrediente){
								return receta.addIngrediente(ingrediente);
							})
							})
						})
	        }).then(function(){
						return models.Ingrediente.create({id: 12, nombre: 'Jamon york', precio: 13}).then(function(ingrediente){
							return models.Pedido.create({id: 1, Cantidad: 2, Precio: 6, IngredienteId: 12, UsuarioId: 1}).then(function(pedido){
								return ingrediente.addPedido(pedido);
							})
						})
					}).then(function(){
						return models.Comentario.bulkCreate([
							{id: 1, mensaje: "Comentario 1", RecetaId: 1},
							{id: 2, mensaje: "Comentario 2", RecetaId: 1},
							{id: 3, mensaje: "Comentario 3", RecetaId: 1},
							{id: 4, mensaje: "Comentario 1", RecetaId: 2}
						])
					})
				});
		})
	});
}
