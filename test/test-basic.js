var app = require('../app');
var models = require('../models');
var supertest = require('supertest');
var assert = require('assert');

describe('Test de BasicAuth.js', function(){
  it('POST / crear una categoria sin error en la autentificacion, se espera 400', function(done){
    var categoria = {nombre : "categoria de prueba"};
    supertest(app)
    .post('/categorias/')
    .send(categoria)
    .auth('usuario','123456')
      .expect(201,done)
  });
  it('PUT / modificar una categoria con id = 1 con error en la autentificacion, se espera 403', function(done){
    var categoria = {Nombre : "categoria de prueba"};
    supertest(app)
    .put('/categorias/1')
    .send(categoria)
    .auth('usuario1','123456')
      .expect(403,done)
  });
  it('PUT / modificar una categoria con id = 1 con error en la autentificacion, se espera 401', function(done){
    var categoria = {Nombre : "categoria de prueba"};
    supertest(app)
    .put('/categorias/1')
    .send(categoria)
      .expect(401,done)
  });
});
