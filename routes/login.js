var express = require('express');
var router = express.Router();
var models = require("../models");
var BasicAuth = require('./BasicAuth');
var Paginate = require('../paginate');


router.get('/',function(pet, resp, next){
  if(pet.headers.authorization==undefined) {
    resp.status(401)
    resp.setHeader('WWW-Authenticate', 'Basic realm="Necesitas iniciar sesión"');
    resp.send("Tienes que meter tus credenciales.").end();
  }
  else {
    var credenciales=new Buffer(pet.headers.authorization.split(' ')[1], 'base64')
                                    .toString('ascii').split(':');

      models.Usuario.find({where:{nombre:credenciales[0], password:credenciales[1]}}).then(function(usuario){
        if(usuario){
          resp.status(200).end();
        }
        else{
          resp.status(403).send("Credenciales incorrectas").end();
        }
      })
  }
});
module.exports = router;
