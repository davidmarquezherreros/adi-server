var app = require('../app');
var models = require('../models');
var supertest = require('supertest');
var assert = require('assert');
var rellenarBD = require('./rellenarBD');

describe('test de la app web recetas', function(){
	//Inicializamos la BD antes de ejecutar los test
	beforeEach(function (done) {
		rellenarBD.rellenarBD().finally(function() {
			done();
		});
	});
  it('GET / devuelve todos las recetas, se espera 200', function(done){
    supertest(app)
    .get('/categorias')
      .expect(200)
        .expect(function(res) {
          assert(res.text.indexOf('Carnes') != -1);
          assert(res.text.indexOf('Pescados') != -1);
          assert(res.text.indexOf('Pastas') != -1);
    })
    .end(done);
  });
  it('GET / devuelve la categoria con id = 1, se espera 200', function(done){
    supertest(app)
    .get('/categorias/1')
      .expect(200)
        .expect(function(res) {
          assert(res.text.indexOf('Carnes') != -1);
    })
    .end(done);
  });
  it('GET / devuelve la categoria con id = a, se espera 400', function(done){
    supertest(app)
    .get('/categorias/a')
      .expect(400,done)
  });
  it('GET / devuelve la categoria con id = 100, se espera 404', function(done){
    supertest(app)
    .get('/categorias/100')
      .expect(404,done)
  });
  it('POST / crear una categoria sin error en el JSON, se espera 201', function(done){
    var categoria = {nombre : "categoria de prueba"};
    supertest(app)
    .post('/categorias/')
    .send(categoria)
    .auth('usuario','123456')
      .expect(201,done)
  });
  it('POST / crear una categoria con error en el JSON, se espera 400', function(done){
    var categoria = {Nombre : "categoria de prueba"};
    supertest(app)
    .post('/categorias/')
    .send(categoria)
    .auth('usuario','123456')
      .expect(400,done)
  });
  it('PUT / modificar una categoria con id = 1 sin error en el JSON, se espera 204', function(done){
    var categoria = {nombre : "categoria de prueba"};
    supertest(app)
    .put('/categorias/1')
    .send(categoria)
    .auth('usuario','123456')
      .expect(204,done)
  });
  it('PUT / modificar una categoria con id = 1 con error en el JSON, se espera 400', function(done){
    var categoria = {Nombre : "categoria de prueba"};
    supertest(app)
    .put('/categorias/1')
    .send(categoria)
    .auth('usuario','123456')
      .expect(400,done)
  });
  it('PUT / modificar una categoria con id = a sin error en el JSON, se espera 400', function(done){
    var categoria = {nombre : "categoria de prueba"};
    supertest(app)
    .put('/categorias/a')
    .send(categoria)
    .auth('usuario','123456')
      .expect(400,done)
  });
  it('PUT / modificar una categoria con id = 100 sin error en el JSON, se espera 404', function(done){
    var categoria = {nombre : "categoria de prueba"};
    supertest(app)
    .put('/categorias/100')
    .send(categoria)
    .auth('usuario','123456')
      .expect(404,done)
  });
  it('GET / conseguir todas las recetas con categoria id = 1, se espera 200', function(done){
    supertest(app)
    .get('/categorias/1/recetas/')
      .expect(200)
        .expect(function(res) {
          assert(res.text.indexOf('Ternera con parmesano') != -1);
          assert(res.text.indexOf('Ternera con sal') != -1);
          assert(res.text.indexOf('Cocinas la carne y le pones sal') != -1);
    })
    .end(done);
  });
  it('GET / conseguir todas las recetas con categoria id = a, se espera 400', function(done){
    supertest(app)
    .get('/categorias/a/recetas/')
      .expect(400,done)
  });
  it('GET / conseguir todas las recetas con categoria id = 100, se espera 404', function(done){
    supertest(app)
    .get('/categorias/100/recetas/')
      .expect(404, done)
  });
});
