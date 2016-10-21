var express = require('express')
var app = express()
var usuarios = require('../models/usuarios')




app.get('/api/items/',function(pet,resp){
	var array = [];
	usuarios.forEach(function(valor){
		array.push(valor)
	})
	resp.send(array)
})

app.get('*', function(pet, resp){
	resp.send('Hola soy express que tal')
})
/**
 * Ponemos el servidor en marcha
 **/
app.listen(3000,function(){
	console.log('Servidor funcionando en http://localhost:3000')
})
