var express = require('express');
var router = express.Router();
var models = require("../models");
var BasicAuth = require('./BasicAuth');
var Paginate = require('../paginate');

// Listar todos los ingredientes
router.get('/',function(pet, resp, next){
  models.Ingrediente.findAll().then(function(ingredientes) {

		var opts = {
			limit: parseInt(pet.query.limit) || 5,
			page: parseInt(pet.query.page) || 1
		};

		var pager = new Paginate(ingredientes, opts.limit);

		var result = {};
		result.ingredientes = pager.page(opts.page);
		result._links = pager.getLinks(pet);

		resp.send(result);
	});
});

// Buscar ingrediente por id
router.get('/:id',function(pet, resp, next){
  if(isNaN(pet.params.id)){
    resp.status(400).send('Bad request').end();
  }
  else{
    models.Ingrediente.find(pet.params.id).then(function(ingrediente){
      if(ingrediente){
        resp.status(200).send(ingrediente).end();
      }
      else{
        resp.status(404).send('Resource not found').end();
      }
    });
  }
});
// Modificar un ingrediente


module.exports = router;
