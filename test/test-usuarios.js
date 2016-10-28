var app = require('../app');
var models = require('../models');
var supertest = require('supertest');
var assert = require('assert');
var rellenarBD = require('./rellenarBD');


describe('test de la app web usuarios', function(){
	//Inicializamos la BD antes de ejecutar los test
	beforeEach('Reset BD',function (done) {
		rellenarBD.rellenarBD().finally(function() {
			done();
		});
	});

	it('GET / devuelve todos los usuarios, se espera 200', function(done){
		supertest(app)
		.get('/usuarios')
		  .expect(200)
		    .expect(function(res) {
    			assert(res.text.indexOf('Lucas') != -1);
          assert(res.text.indexOf('Ana') != -1);
          assert(res.text.indexOf('Juan') != -1);
          assert(res.text.indexOf('Api') != -1);
          assert(res.text.indexOf('juan.api@email.com') != -1);
		})
		.end(done);
	});
  it('GET / La ruta no esta definida, se espera 404', function(done){
		supertest(app)
		.get('/usuario')
		.expect(404)
		.expect(function(res){res.text.indexOf('Not Found')!=-1}).end(done);
	});
  it('GET / devuelve el usuario con id = 1, se espera 200', function(done){
		supertest(app)
		.get('/usuarios/1')
		  .expect(200)
		    .expect(function(res) {
    			assert(res.text.indexOf('Lucas') != -1);
          assert(res.text.indexOf('Api') != -1);
          assert(res.text.indexOf('lucas.api@email.com') != -1);
		})
		.end(done);
	});
  it('GET / devuelve el usuario con id = a, se espera 400', function(done){
    supertest(app)
    .get('/usuarios/a')
    .expect(400)
    .expect(function(res){res.text.indexOf('Bad request')!=-1}).end(done);
  });
  it('GET / devuelve el usuario con id = 99, se espera 404', function(done){
    supertest(app)
    .get('/usuarios/99')
    .expect(404)
    .expect(function(res){res.text.indexOf('Resource not found')!=-1}).end(done);
  });
  it('PUT / modificar un usuario con id = 1, se espera 204', function(done) {
    var usuario = { nombre : 'David', apellidos : 'Marquez', email: "david.marquez@email.com" };
    supertest(app)
    .put('/usuarios/1')
    .auth('usuario', '123456')
    .send(usuario)
    .expect(204, done);
  });
  it('PUT / modificar un usuario con id = a, se espera 400', function(done) {
    var usuario = { nombre : 'David', apellidos : 'Marquez', email: "david.marquez@email.com" };
    supertest(app)
    .put('/usuarios/a')
    .auth('usuario', '123456')
    .send(usuario)
    .expect(400)
    .expect(function(res){res.text.indexOf('Bad request')!=-1}).end(done);
  });
  it('PUT / modificar un usuario con id = 100, se espera 404', function(done) {
    var usuario = { nombre : 'David', apellidos : 'Marquez', email: "david.marquez@email.com" };
    supertest(app)
    .put('/usuarios/100')
    .auth('usuario', '123456')
    .send(usuario)
    .expect(404)
    .expect(function(res){res.text.indexOf('Resource not found')!=-1}).end(done);
  });
  it('POST / crear un usuario, se espera 201', function(done) {
    var usuario = { nombre : 'Pedro Ramon', apellidos : 'Api', email: "pedroramon.api@email.com" };
    supertest(app)
    .post('/usuarios')
    .auth('usuario', '123456')
    .send(usuario)
    .expect(201, done);
  });
  it('POST / crear un usuario con error en el JSON, se espera 400', function(done) {
    var usuario = { Nombre : 'Pedro Ramon', apellidos : 'Api', email: "pedroramon.api@email.com" };
    supertest(app)
    .post('/usuarios')
    .auth('usuario', '123456')
    .send(usuario)
    .expect(400)
    .expect(function(res){res.text.indexOf('Bad request')!=-1}).end(done);
  });
  it('DELETE / borrar un usuario con error en el id=a, se espera 400', function(done) {
    supertest(app)
    .delete('/usuarios/a')
    .auth('usuario', '123456')
    .expect(400)
    .expect(function(res){res.text.indexOf('Bad request')!=-1}).end(done);
  });
  it('DELETE / borrar un usuario con id=1, se espera 204', function(done) {
    supertest(app)
    .delete('/usuarios/1')
    .auth('usuario', '123456')
    .expect(204,done);
  });
  it('DELETE / borrar un usuario con el id=100, se espera 404', function(done) {
    supertest(app)
    .delete('/usuarios/100')
    .auth('usuario', '123456')
    .expect(404)
    .expect(function(res){res.text.indexOf('Resource not found')!=-1}).end(done);
  });
  it('POST / crear un pedido para el usuario con id=1 con error en el JSON, se espera 400', function(done) {
    var pedido = { Precio : 'Pedro Ramon', Cantidad : 'Api'};
    supertest(app)
    .post('/usuarios/1/pedidos')
    .auth('usuario', '123456')
    .send(pedido)
    .expect(400)
    .expect(function(res){res.text.indexOf('Bad request')!=-1}).end(done);
  });
  it('POST / crear un pedido para el usuario con id=100 sin error en el JSON, se espera 400', function(done) {
    var pedido = { precio : 10, cantidad : 100};
    supertest(app)
    .post('/usuarios/100/pedidos')
    .auth('usuario', '123456')
    .send(pedido)
    .expect(400)
    .expect(function(res){res.text.indexOf('Bad request')!=-1}).end(done);
  });
  it('POST / crear un pedido para el usuario con id=2 sin error en el JSON, se espera 201', function(done) {
    var pedido = { precio : 10, cantidad : 100};
    supertest(app)
    .post('/usuarios/2/pedidos')
    .auth('usuario', '123456')
    .send(pedido)
    .expect(201, done);
  });
  it('POST / añadir un ingrediente para el usuario con id=2, se espera 201', function(done) {
    supertest(app)
    .post('/usuarios/2/pedidos/1/ingredientes/1')
    .auth('usuario', '123456')
    .expect(201, done);
  });
  it('POST / añadir un ingrediente para el usuario con id=2 con error en el id del pedido, se espera 404', function(done) {
    supertest(app)
    .post('/usuarios/2/pedidos/10/ingredientes/1')
    .auth('usuario', '123456')
    .expect(404)
    .expect(function(res){res.text.indexOf('Resource not found')!=-1}).end(done);
  });
  it('POST / añadir un ingrediente para el usuario con id=2 con error en el id del ingrediente, se espera 404', function(done) {
    supertest(app)
    .post('/usuarios/2/pedidos/1/ingredientes/100')
    .auth('usuario', '123456')
    .expect(404)
    .expect(function(res){res.text.indexOf('Resource not found')!=-1}).end(done);
  });
});
