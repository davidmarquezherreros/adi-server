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
router.get('/:id',function(pet, resp, next) {
  if(isNaN(pet.params.id)){
    resp.status(400).send('Bad request').end();
  }
  else{
    models.Comentario.find(pet.params.id).then(function(comentario){
      if(comentario){
          resp.status(200).send(comentario);
        }
        else{
          resp.status(404).send("Resource not found");
        }
    })
  }
});
// Modificar un comentario
router.put('/:id', BasicAuth.BasicAuth, function(pet, resp, next){
  var id = pet.params.id;
  if(isNaN(id)){
    resp.status(400).send('Bad request').end();
  }
  else{
    var nuevo = pet.body;
    if(nuevo.mensaje){
        models.Comentario.find(id).then(function(comentario){
        if(comentario){
          models.Comentario.update({
            mensaje: nuevo.mensaje,
          },{
            where: {id: pet.params.id}
          }).then(function(){
            resp.status(204).send();
          })
        }
        else{
          resp.status(404).send("Resource not found");
        }
      })
    }
    else{
      resp.status(400).send('Bad request').end();
    }
  }
})

module.exports = router;
