var app = require('../app');
var models = require('../models');
var supertest = require('supertest');
var assert = require('assert');
var rellenarBD = require('./rellenarBD');

describe('Test de pedidos.js', function(){
	//Inicializamos la BD antes de ejecutar los test
	beforeEach(function (done) {
		rellenarBD.rellenarBD().finally(function() {
			done();
		});
	});
  it('GET / devuelve todos los pedido, se espera 200', function(done){
    supertest(app)
    .get('/pedidos')
      .expect(200)
        .expect(function(res) {
          assert(res.text.indexOf('2') != -1);
    })
    .end(done);
  });
  it('GET / devuelve el pedido con id = 1, se espera 200', function(done){
    supertest(app)
    .get('/pedidos/1')
      .expect(200)
        .expect(function(res) {
          assert(res.text.indexOf('2') != -1);
    })
    .end(done);
  });
  it('GET / devuelve el pedido con id = a, se espera 400', function(done){
    supertest(app)
    .get('/pedidos/a')
      .expect(400,done)
  });
  it('GET / devuelve el pedido con id = 100, se espera 404', function(done){
    supertest(app)
    .get('/pedidos/100')
      .expect(404,done)
  });
  it('PUT / modificar un pedido con id = 1 sin error en el JSON, se espera 204', function(done){
    var pedido = {cantidad: 100, precio: 1000};
    supertest(app)
    .put('/pedidos/1')
    .send(pedido)
    .auth('usuario','123456')
      .expect(204,done)
  });
  it('PUT / modificar una categoria con id = 1 con error en el JSON, se espera 400', function(done){
    var pedido = {cantidad: 100, Precio: 1000};
    supertest(app)
    .put('/pedidos/1')
    .send(pedido)
    .auth('usuario','123456')
      .expect(400,done)
  });
  it('PUT / modificar una categoria con id = a sin error en el JSON, se espera 400', function(done){
    var pedido = {cantidad: 100, precio: 1000};
    supertest(app)
    .put('/pedidos/a')
    .send(pedido)
    .auth('usuario','123456')
      .expect(400,done)
  });
  it('PUT / modificar una categoria con id = 100 sin error en el JSON, se espera 404', function(done){
    var pedido = {cantidad: 100, precio: 1000};
    supertest(app)
    .put('/pedidos/100')
    .send(pedido)
    .auth('usuario','123456')
      .expect(404,done)
  });
});
