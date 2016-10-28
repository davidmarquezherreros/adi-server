var express = require('express');
var router = express.Router();
var models = require("../models");
var BasicAuth = require('./BasicAuth');
var Paginate = require('../paginate');


// Listar todos los usuarios
router.get('/',function(pet, resp, next) {
  models.Usuario.findAll().then(function(usuarios) {

		var opts = {
			limit: parseInt(pet.query.limit) || 10,
			page: parseInt(pet.query.page) || 1
		};

		var pager = new Paginate(usuarios, opts.limit);

		var result = {};
		result.usuarios = pager.page(opts.page);
		result._links = pager.getLinks(pet);

		resp.send(result);
	});
});

// Buscar usuario
router.get('/:id',function(pet, resp, next) {
  if(isNaN(pet.params.id)){
    resp.status(400).send('Bad request').end();
  }
  else{
    models.Usuario.find(pet.params.id).then(function(user){
      if(user){
          resp.status(200).send(user);
        }
        else{
          resp.status(404).send("Resource not found");
        }
    })
  }
});
// Modificar usuario
router.put('/:id', BasicAuth.BasicAuth, function(pet, resp, next){
  var id = pet.params.id;
  if(isNaN(id)){
    resp.status(400).send('Bad request').end();
  }
  else{
    var nuevo = pet.body;
    if(nuevo.nombre && nuevo.apellidos && nuevo.email){
        models.Usuario.find(id).then(function(usuario){
        if(usuario){
          models.Usuario.update({
            nombre: nuevo.nombre,
            apellidos: nuevo.apellidos,
            email: nuevo.email
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
// Crear usuario
router.post('/', BasicAuth.BasicAuth, function(pet, resp, next){
  var nuevo = pet.body;
  if(nuevo.nombre && nuevo.apellidos && nuevo.email){
    models.Usuario.create({
      nombre: nuevo.nombre,
      apellidos: nuevo.apellidos,
      email: nuevo.email
    }).then(function(user){
      resp.header('Location','http://localhost:3000/usuarios/'+user.id);
      resp.status(201).send(user);
    })
  }
  else{
    resp.status(400).send('Bad request').end();
  }
})
// Borrar usuario
router.delete('/:id', BasicAuth.BasicAuth, function(pet, resp, next){
  var id = pet.params.id;
  if(isNaN(id)){
    resp.status(400).send('Bad request').end();
  }else{
    models.Usuario.find(id).then(function(usuario){
      if(usuario){
        models.Usuario.destroy({
					where: {
						id: id
					}
				}).then(function(){
          resp.status(204).send().end();
        })
      }
      else{
        resp.status(404).send('Resource not found').end();
      }
    })
  }
})

// Crear pedido usuario
router.post('/:id/pedidos/',BasicAuth.BasicAuth,function(pet, resp, next){
  var id = pet.params.id;
  if(isNaN(id)){
    resp.status(400).send('Bad request').end();
  }
  else{
    var pedido = pet.body;
    models.Usuario.find(id).then(function(usuario){
      if(usuario){
        if(isNaN(pedido.precio)==false && isNaN(pedido.cantidad)===false){
          models.Pedido.create({
            Precio: pedido.precio,
            Cantidad: pedido.cantidad,
            UsuarioId: id
          }).then(function(pedido){
            resp.header('Location','http://localhost:3000/usuarios/'+id+'/pedidos/'+pedido.id);
            resp.status(201).send(pedido).end();
          });
        }
        else{
          resp.status(400).send('Bad request').end();
        }
      }
      else{
        resp.status(400).send('Bad request').end();
      }
    });
  }
});
// Conseguir todos los ingredientes de un pedido
router.get('/:idUsuario/pedidos/:idPedido/ingredientes',BasicAuth.BasicAuth, function(pet,resp,next){
  var id = pet.params.idUsuario;
  if(isNaN(id) || isNaN(pet.params.idPedido)){
    resp.status(400).send('Bad request').end();
  }
  else{
    models.Usuario.find(id).then(function(usuario){
      if(usuario){
        models.Pedido.find(pet.params.idPedido).then(function(pedido){
          if(pedido){
            return pedido.getIngrediente();
          }
          else{
            resp.status(404).send('Resource not found').end();
          }
        }).then(function(ingredientes){
          resp.status(200).send(ingredientes);
        })
      }
      else{
        resp.status(404).send('Resource not found');
      }
    });
  }
});
// Añadir ingrediente al pedido del usuario
router.post('/:idUsuario/pedidos/:idPedido/ingredientes/:idIngrediente',BasicAuth.BasicAuth, function(pet, resp, next){
  var id = pet.params.idUsuario;
  if(isNaN(id) || isNaN(pet.params.idPedido) || isNaN(pet.params.idIngrediente)){
    resp.status(400).send('Bad request').end();
  }
  else{
    models.Pedido.find(pet.params.idPedido).then(function(pedido){
      if(pedido){
        models.Ingrediente.find(pet.params.idIngrediente).then(function(ingrediente){
          if(ingrediente){
            pedido.addIngrediente(ingrediente);
            resp.header('Location','http://localhost:3000/usuarios/'+id+'/pedidos/'+pedido.id+'/ingredientes');
            resp.status(201).send().end();
          }
          else{
            resp.status(404).send('Resource not found').end();
          }
        });
      }
      else{
        resp.status(404).send('Resource not found').end();
      }
    })
  }
});
module.exports = router;
