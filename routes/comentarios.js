var express = require('express');
var router = express.Router();
var models = require("../models");
var BasicAuth = require('./BasicAuth');
var Paginate = require('../paginate');

// Listar todos los comentarios
router.get('/',function(pet, resp, next){
  models.Comentario.findAll().then(function(comentarios) {

		var opts = {
			limit: parseInt(pet.query.limit) || 5,
			page: parseInt(pet.query.page) || 1
		};

		var pager = new Paginate(comentarios, opts.limit);

		var result = {};
		result.comentarios = pager.page(opts.page);
		result._links = pager.getLinks(pet);

		resp.send(result);
	});
});

// Buscar comentario por id

// Modificar un comentario


module.exports = router;
