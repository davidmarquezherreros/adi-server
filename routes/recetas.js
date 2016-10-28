var express = require('express');
var router = express.Router();
var models = require("../models");
var BasicAuth = require('./BasicAuth');
var Paginate = require('../paginate');

// Listar todas las recetas
router.get('/',function(pet, resp, next) {
  models.Receta.findAll().then(function(recetas) {

		var opts = {
			limit: parseInt(pet.query.limit) || 5,
			page: parseInt(pet.query.page) || 1
		};

		var pager = new Paginate(recetas, opts.limit);

		var result = {};
		result.recetas = pager.page(opts.page);
		result._links = pager.getLinks(pet);

		resp.send(result);
	});
});
// Buscar receta
router.get('/:id',function(pet, resp, next) {
  if(isNaN(pet.params.id)){
    resp.status(400).send('Bad request').end();
  }
  else{
    models.Receta.find(pet.params.id).then(function(receta){
      if(receta){
        resp.status(200).send(receta);
      }
      else{
        resp.status(404).send("Resource not found");
      }
    })
  }
});
// Conseguir todos los comentarios de una receta
router.get('/:id/comentarios',function(pet, resp, next) {
  if(isNaN(pet.params.id)){
    resp.status(400).send('Bad request').end();
  }
  else{
    models.Receta.find(pet.params.id).then(function(receta){
      if(receta){
        return receta.getComentarios();
      }
      else{
        resp.status(404).send("Resource not found");
      }
    }).then(function(comentarios){
      resp.send(comentarios);
    })
  }
});
// Añadir comentario una receta
router.post('/:id/comentarios',BasicAuth.BasicAuth,function(pet, resp, next){
  if(isNaN(pet.params.id)){
    resp.status(400).send('Bad Request').end();
  }
  else{
    var comentario = pet.body
    if(comentario.mensaje){
      models.Receta.find(pet.params.id).then(function(receta){
        if(receta){
          models.Comentario.create({
            mensaje: comentario.mensaje,
            RecetaId: pet.params.id
          }).then(function(comentario){
            resp.status(201).send(comentario);
          });
        }
        else{
          resp.status(404).send('Not Found').end();
        }
      });
    }
    else{
      resp.status(400).send('Bad Request').end();
    }
  }
});

// Crear receta
router.post('/',BasicAuth.BasicAuth,function(pet,resp,next){
  var nuevo = pet.body;
  if(nuevo.nombre && nuevo.descripcion && isNaN(nuevo.dificultad)==false && isNaN(nuevo.categoria)==false){
    models.Categoria.find(nuevo.categoria).then(function(categoria){
      if(categoria){
        models.Receta.create({
          nombre : nuevo.nombre,
          descripcion : nuevo.descripcion,
          dificultad : nuevo.dificultad,
          CategoriaId : nuevo.categoria,
        }).then(function(receta){
          resp.header('Location',"http://localhost:3000/recetas/"+receta.id);
          resp.status(201).send(receta);
        })
      }
      else{
        resp.status(404).send("Not found"); // CATEGORIA NOT FOUND
      }
    })
  }
  else{
    resp.status(400).send("Bad request").end();
  }
});
// Modificar receta
router.put('/:id',BasicAuth.BasicAuth, function(pet, resp, next){
  var id = pet.params.id;
  var nuevo = pet.body;
  if(isNaN(id)){
    resp.status(400).send("Bad request").end();
  }
  else{
    if(nuevo.nombre && nuevo.descripcion && isNaN(nuevo.dificultad)==false && isNaN(nuevo.categoria)==false){
      models.Categoria.find(nuevo.categoria).then(function(categoria){
        if(categoria){
          models.Receta.find(pet.params.id).then(function(receta){
            if(receta){
              models.Receta.update(
                {
                  nombre : nuevo.nombre,
                  descripcion : nuevo.descripcion,
                  dificultad : nuevo.dificultad,
                  CategoriaId : nuevo.categoria,
                },{
                  where: {id: pet.params.id}
                }).then(function(){
                  resp.status(204).send();
                })
            }
            else{
              resp.status(404).send("Resource not found").end();
            }
          })
        }
        else{
          resp.status(404).send("Resource not found").end(); // Categoria no encontrada
        }
      });
    }
    else{
      resp.status(400).send("Bad request").end();
    }
  }
});
// Recuperar todos los ingredientes de una receta
router.get('/:id/ingredientes',function(pet, resp, next){
  if(isNaN(pet.params.id)){
    resp.status(400).send("Bad request").end();
  }
  else{
    models.Receta.find(pet.params.id).then(function(receta){
      if(receta){
        return receta.getIngrediente();
      }
      else{
        resp.status(404).send("Resource not found");
      }
    }).then(function(ingredientes){
      resp.send(ingredientes);
    })
  }
});

// Añadir ingrediente a una receta
router.put('/:id/ingredientes/:id2',BasicAuth.BasicAuth,function(pet, resp, next){
  if(isNaN(pet.params.id) || isNaN(pet.params.id2)){
    resp.status(400).send('Bad Request').end();
  }
  else{
    models.Receta.find(pet.params.id).then(function(receta){
      if(receta){
        models.Ingrediente.find(pet.params.id2).then(function(ingrediente){
          if(ingrediente){
            receta.addIngrediente(ingrediente);
            resp.status(204).send().end();
          }
          else{
            resp.status(404).send('Resource not found').end();
          }
        })
      }else{
        resp.status(404).send('Resource not found').end();
      }
    })
  }
});




module.exports = router;
