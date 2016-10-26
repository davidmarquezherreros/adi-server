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
router.put('/:id', BasicAuth.BasicAuth, function(pet, resp, next){
  var id = pet.params.id;
  if(isNaN(id)){
    resp.status(400).send('Bad request').end();
  }
  else{
    var nuevo = pet.body;
    if(nuevo.nombre && isNaN(nuevo.precio)==false){
        models.Ingrediente.find(id).then(function(ingrediente){
        if(ingrediente){
          models.Ingrediente.update({
            nombre: nuevo.nombre,
            precio: nuevo.precio,
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
});
// Crear ingrediente
router.post('/', BasicAuth.BasicAuth, function(pet, resp, next){
  var nuevo = pet.body;
  if(nuevo.nombre && isNaN(nuevo.precio)==false){
    models.Ingrediente.findOne({where: {nombre: nuevo.nombre}}).then(function(ing){
      if(ing){
        resp.header('Location','http://localhost:3000/usuarios/'+ing.id);
        resp.status(201).send(ing).end();
      }
      else{
        models.Ingrediente.create({
          nombre: nuevo.nombre,
          precio: nuevo.precio,
        }).then(function(ingrediente){
          resp.header('Location','http://localhost:3000/usuarios/'+ingrediente.id);
          resp.status(201).send(ingrediente).end();
        })
      }
    })
  }
  else{
    resp.status(400).send('Bad request').end();
  }
})

module.exports = router;
