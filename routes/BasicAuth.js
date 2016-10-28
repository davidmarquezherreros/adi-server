var express = require('express');
var router = express.Router();

// usuario:123456
var auth = "dXN1YXJpbzoxMjM0NTY="

exports.BasicAuth = function (pet, resp, next) {
	if(pet.headers.authorization==undefined) {
		resp.status(401)
		resp.setHeader('WWW-Authenticate', 'Basic realm="Necesitas iniciar sesión"');
		resp.send("Tienes que meter tus credenciales.").end();
	}
	else {
    var credenciales=new Buffer(pet.headers.authorization.split(' ')[1], 'base64')
                                    .toString('ascii').split(':');
			if(credenciales[0]=="usuario" && credenciales[1]=="123456"){
        next();
      }
      else{
        resp.status(403);
        resp.send("Credenciales incorrectas");
      }
	}
}
