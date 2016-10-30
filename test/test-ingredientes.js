var app = require('../app');
var models = require('../models');
var supertest = require('supertest');
var assert = require('assert');
var rellenarBD = require('./rellenarBD');

describe('Test de ingredientes.js', function(){
	//Inicializamos la BD antes de ejecutar los test
	beforeEach(function (done) {
		rellenarBD.rellenarBD().finally(function() {
			done();
		});
	});
  it('GET / devuelve todos los ingredientes, se espera 200', function(done){
    supertest(app)
    .get('/ingredientes')
      .expect(200)
        .expect(function(res) {
          assert(res.text.indexOf('2') != -1);
    })
    .end(done);
  });
  it('GET / devuelve el ingredientes con id = 1, se espera 200', function(done){
    supertest(app)
    .get('/ingredientes/1')
      .expect(200)
        .expect(function(res) {
          assert(res.text.indexOf('2') != -1);
    })
    .end(done);
  });
  it('GET / devuelve el ingredientes con id = a, se espera 400', function(done){
    supertest(app)
    .get('/ingredientes/a')
      .expect(400,done)
  });
  it('GET / devuelve el ingredientes con id = 100, se espera 404', function(done){
    supertest(app)
    .get('/ingredientes/100')
      .expect(404,done)
  });
  it('PUT / modificar un ingredientes con id = 1 sin error en el JSON, se espera 204', function(done){
    var ingredientes = {nombre: "ingrediente de prueba", precio: 1000};
    supertest(app)
    .put('/ingredientes/1')
    .send(ingredientes)
    .auth('usuario','123456')
      .expect(204,done)
  });
  it('PUT / modificar una ingrediente con id = 1 con error en el JSON, se espera 400', function(done){
    var ingredientes = {nombre: "ingrediente de prueba", Precio: 1000};
    supertest(app)
    .put('/ingredientes/1')
    .send(ingredientes)
    .auth('usuario','123456')
      .expect(400,done)
  });
  it('PUT / modificar una ingrediente con id = a sin error en el JSON, se espera 400', function(done){
    var ingredientes = {nombre: "ingrediente de prueba", precio: 1000};
    supertest(app)
    .put('/ingredientes/a')
    .send(ingredientes)
    .auth('usuario','123456')
      .expect(400,done)
  });
  it('PUT / modificar una ingrediente con id = 100 sin error en el JSON, se espera 404', function(done){
    var ingredientes = {nombre: "ingrediente de prueba", precio: 1000};
    supertest(app)
    .put('/ingredientes/100')
    .send(ingredientes)
    .auth('usuario','123456')
      .expect(404,done)
  });
});
