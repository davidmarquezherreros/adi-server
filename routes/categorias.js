var express = require('express');
var router = express.Router();
var models = require("../models");
var BasicAuth = require('./BasicAuth');
var Paginate = require('../paginate');


// Listar todas las categorias
router.get('/',function(pet, resp, next){
  models.Categoria.findAll().then(function(categorias) {

		var opts = {
			limit: parseInt(pet.query.limit) || 5,
			page: parseInt(pet.query.page) || 1
		};

		var pager = new Paginate(categorias, opts.limit);
		var result = {};

		result.categorias = pager.page(opts.page);
		result._links = pager.getLinks(pet);
		resp.send(result);

	});
});

// Buscar categoria por id
router.get('/:id',function(pet, resp, next) {
  if(isNaN(pet.params.id)){
    resp.status(400).send('Bad request').end();
  }
  else{
    models.Categoria.find(pet.params.id).then(function(categoria){
      if(categoria){
          resp.status(200).send(categoria);
        }
        else{
          resp.status(400).send("Resource not found");
        }
    })
  }
});
// Modificar una categoria
router.put('/:id', BasicAuth.BasicAuth, function(pet, resp, next){
  var id = pet.params.id;
  if(isNaN(id)){
    resp.status(400).send('Bad request').end();
  }
  else{
    var nuevo = pet.body;
    if(nuevo.nombre){
        models.Categoria.find(id).then(function(categoria){
        if(categoria){
          models.Categoria.update({
            nombre: nuevo.nombre,
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
// Crear una categoria **FALTA MIRAR QUE nuevo.nombre no este en la BD**
router.post('/', BasicAuth.BasicAuth, function(pet, resp, next){
  var nuevo = pet.body;
  if(nuevo.nombre){
    models.Categoria.create({
      nombre: nuevo.nombre
    }).then(function(categoria){
      resp.header('Location','http://localhost:3000/usuarios/'+categoria.id);
      resp.status(201).send(categoria);
    })
  }
  else{
    resp.status(400).send('Bad request').end();
  }
})

module.exports = router;
