var app = require('../app');
var models = require('../models');
var supertest = require('supertest');
var assert = require('assert');
var rellenarBD = require('./rellenarBD');

describe('Test de comentarios.js', function(){
	//Inicializamos la BD antes de ejecutar los test
	beforeEach(function (done) {
		rellenarBD.rellenarBD().finally(function() {
			done();
		});
	});
  it('GET / devuelve todos las recetas, se espera 200', function(done){
    supertest(app)
    .get('/comentarios')
      .expect(200)
        .expect(function(res) {
          assert(res.text.indexOf('Comentario 1') != -1);
          assert(res.text.indexOf('Comentario 2') != -1);
          assert(res.text.indexOf('Comentario 3') != -1);
    })
    .end(done);
  });
  it('GET / devuelve el comentario con id = 1, se espera 200', function(done){
    supertest(app)
    .get('/comentarios/1')
      .expect(200)
        .expect(function(res) {
          assert(res.text.indexOf('Comentario') != -1);
    })
    .end(done);
  });
  it('GET / devuelve el comentario con id = a, se espera 400', function(done){
    supertest(app)
    .get('/comentarios/a')
      .expect(400,done)
  });
  it('GET / devuelve el comentario con id = 100, se espera 404', function(done){
    supertest(app)
    .get('/comentarios/100')
      .expect(404,done)
  });
  it('PUT / modificar un comentario con id = 1 sin error en el JSON, se espera 204', function(done){
    var mensaje = {mensaje : "mensaje de prueba"};
    supertest(app)
    .put('/comentarios/1')
    .send(mensaje)
    .auth('usuario','123456')
      .expect(204,done)
  });
  it('PUT / modificar una categoria con id = 1 con error en el JSON, se espera 400', function(done){
    var mensaje = {Mensaje : "mensaje de prueba"};
    supertest(app)
    .put('/comentarios/1')
    .send(mensaje)
    .auth('usuario','123456')
      .expect(400,done)
  });
  it('PUT / modificar una categoria con id = a sin error en el JSON, se espera 400', function(done){
    var mensaje = {mensaje : "mensaje de prueba"};
    supertest(app)
    .put('/comentarios/a')
    .send(mensaje)
    .auth('usuario','123456')
      .expect(400,done)
  });
  it('PUT / modificar una categoria con id = 100 sin error en el JSON, se espera 404', function(done){
    var mensaje = {mensaje : "mensaje de prueba"};
    supertest(app)
    .put('/comentario/100')
    .send(mensaje)
    .auth('usuario','123456')
      .expect(404,done)
  });
});
