var express = require('express');
var router = express.Router();
var models = require("../models");
var BasicAuth = require('./BasicAuth');
var Paginate = require('../paginate');


var express = require('express');
var router = express.Router();
var models = require("../models");
var BasicAuth = require('./BasicAuth');
var Paginate = require('../paginate');

// Listar todos los Pedidos
router.get('/',function(pet, resp, next){
  models.Pedido.findAll().then(function(Pedidos) {

		var opts = {
			limit: parseInt(pet.query.limit) || 5,
			page: parseInt(pet.query.page) || 1
		};

		var pager = new Paginate(Pedidos, opts.limit);
		var result = {};

		result.Pedidos = pager.page(opts.page);
		result._links = pager.getLinks(pet);
		resp.send(result);

	});
});

// Buscar Pedido por id
router.get('/:id',function(pet, resp, next) {
  if(isNaN(pet.params.id)){
    resp.status(400).send('Bad request').end();
  }
  else{
    models.Pedido.find(pet.params.id).then(function(Pedido){
      if(Pedido){
          resp.status(200).send(Pedido);
        }
        else{
          resp.status(400).send("Resource not found");
        }
    })
  }
});
// Modificar un Pedido
router.put('/:id', BasicAuth.BasicAuth, function(pet, resp, next){
  var id = pet.params.id;
  if(isNaN(id)){
    resp.status(400).send('Bad request').end();
  }
  else{
    var nuevo = pet.body;
    if(nuevo.cantidad && nuevo.precio){
        models.Pedido.find(id).then(function(Pedido){
        if(Pedido){
          models.Pedido.update({
            Cantidad: nuevo.cantidad,
            Precio: nuevo.precio
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
