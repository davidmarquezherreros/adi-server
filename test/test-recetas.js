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
    .get('/recetas')
      .expect(200)
        .expect(function(res) {
          assert(res.text.indexOf('Ternera con parmesano') != -1);
          assert(res.text.indexOf('Ternera con sal') != -1);
          assert(res.text.indexOf('Cocinas la carne y le pones sal') != -1);
    })
    .end(done);
  });
  it('GET / devuelve la receta con id = 1, se espera 200', function(done){
    supertest(app)
    .get('/recetas/1')
      .expect(200)
        .expect(function(res) {
          assert(res.text.indexOf('Ternera con parmesano') != -1);
    })
    .end(done);
  });
  it('GET / devuelve la receta con id = a, se espera 400', function(done){
    supertest(app)
    .get('/recetas/a')
      .expect(400).expect(function(res){res.text.indexOf('Not Found')!=-1}).end(done);
  });
  it('GET / devuelve la receta con id = 100, se espera 404', function(done){
    supertest(app)
    .get('/recetas/100')
      .expect(404).expect(function(res){res.text.indexOf('Not Found')!=-1}).end(done);
  });
  it('GET / devuelve todos los comentarios de la receta con id = 1, se espera 200', function(done){
    supertest(app)
    .get('/recetas/1/comentarios')
      .expect(200)
        .expect(function(res) {
          assert(res.text.indexOf('Comentario 1') != -1);
          assert(res.text.indexOf('Comentario 2') != -1);
          assert(res.text.indexOf('Comentario 3') != -1);
    })
    .end(done);
  });
  it('GET / devuelve todos los comentarios de la receta con id = 100, se espera 404', function(done){
    supertest(app)
    .get('/recetas/100/comentarios')
      .expect(404).expect(function(res){res.text.indexOf('Not Found')!=-1}).end(done);
  });
  it('GET / devuelve todos los comentarios de la receta con id = a, se espera 400', function(done){
    supertest(app)
    .get('/recetas/a/comentarios')
      .expect(400).expect(function(res){res.text.indexOf('Bad request')!=-1}).end(done);
  });
  it('GET / devuelve todos los ingredientes de la receta con id = a, se espera 400', function(done){
    supertest(app)
    .get('/recetas/a/ingredientes')
      .expect(400).expect(function(res){res.text.indexOf('Bad request')!=-1}).end(done);
  });
  it('GET / devuelve todos los ingredientes de la receta con id = 4, se espera 200', function(done){
    supertest(app)
    .get('/recetas/4/ingredientes')
      .expect(200).expect(function(res){
        res.text.indexOf('jamon serrano')!=-1
        })
      .end(done);
  });
  it('POST / añadir un comentario a la receta con id = a, se espera 400', function(done){
    var comentario = {mensaje: "Comentario de prueba"};
    supertest(app)
    .post('/recetas/a/comentarios')
      .auth('usuario','123456')
      .send(comentario)
      .expect(400).expect(function(res){res.text.indexOf('Bad request')!=-1}).end(done);
    });
    it('POST / añadir un comentario a la receta con id = 100, se espera 404', function(done){
      var comentario = {mensaje: "Comentario de prueba"};
      supertest(app)
      .post('/recetas/100/comentarios')
        .auth('usuario','123456')
        .send(comentario)
        .expect(404).expect(function(res){res.text.indexOf('Not Found')!=-1}).end(done);
      });
    it('POST / añadir un comentario a la receta con id = 100, se espera 201', function(done){
        var comentario = {mensaje: "Comentario de prueba"};
        supertest(app)
        .post('/recetas/1/comentarios')
          .auth('usuario','123456')
          .send(comentario)
          .expect(201,done);
        });
    it('POST / crear una receta con error en el JSON, se espera 400', function(done){
          var recetas = {nombre: "Receta de prueba", descripcion: "Descripcion de prueba", dificultad: "a", categoria: 1};
          supertest(app)
          .post('/recetas/')
            .auth('usuario','123456')
            .send(recetas)
            .expect(400).expect(function(res){res.text.indexOf('Bad request')!=-1}).end(done);
    });
    it('POST / crear una receta sin error en el JSON, se espera 400', function(done){
          var recetas = {nombre: "Receta de prueba", descripcion: "Descripcion de prueba", dificultad: 1, categoria: 1};
          supertest(app)
          .post('/recetas/')
            .auth('usuario','123456')
            .send(recetas)
            .expect(201,done)
    });
    it('PUT / modificar la receta con id = 1 con error en el JSON, se espera 400', function(done){
          var recetas = {nombre: "Receta de prueba", descripcion: "Descripcion de prueba", dificultad: "a", categoria: 1};
          supertest(app)
          .put('/recetas/1')
            .auth('usuario','123456')
            .send(recetas)
            .expect(400).expect(function(res){res.text.indexOf('Bad request')!=-1}).end(done);
    });
    it('PUT / modificar la receta con id = 1 sin error en el JSON, se espera 204', function(done){
          var recetas = {nombre: "Receta de prueba", descripcion: "Descripcion de prueba", dificultad: 1, categoria: 1};
          supertest(app)
          .put('/recetas/1')
            .auth('usuario','123456')
            .send(recetas)
            .expect(204,done)
    });
    it('PUT / modificar la receta con id = 1 con categoria erronea, se espera 404', function(done){
          var recetas = {nombre: "Receta de prueba", descripcion: "Descripcion de prueba", dificultad: 1, categoria: 100};
          supertest(app)
          .put('/recetas/1')
            .auth('usuario','123456')
            .send(recetas)
            .expect(404).expect(function(res){res.text.indexOf('Resource not found')!=-1}).end(done);
    });
    it('PUT / añadir un ingrediente a la receta con id = 1, se espera 204', function(done){
          supertest(app)
          .put('/recetas/1/ingredientes/1')
            .auth('usuario','123456')
            .expect(204,done);
    });
    it('PUT / añadir un ingrediente a la receta con id = 1 e ingrediente erroneo, se espera 404', function(done){
          supertest(app)
          .put('/recetas/1/ingredientes/100')
            .auth('usuario','123456')
            .expect(404).expect(function(res){res.text.indexOf('Resource not found')!=-1}).end(done);
    });
});
