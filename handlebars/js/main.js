var APILista = require('./servicios/API_lista.js')
var handlebars = require('handlebars')


//Plantilla handlebars para renderizar en HTML un item de la lista
//Usamos backticks (funcionalidad de ES6) para delimitar la cadena para que pueda ser multilínea
//Con el "javascript:" en el href conseguimos que un enlace pueda llamar a código JS
var templateItem = `
   <div>
      <span id="{{id}}">
         <strong>{{nombre}}</strong></em>
      </span>
      <a id="enlace_{{id}}" href="javascript:verDetalles({{id}})">Detalles</a>
      <a id="enlace_modificar{{id}}" href="javascript:modificarIngrediente({{id}})">Modificar</a>
      <a id="enlace_eliminar{{id}}" href="javascript:eliminarIngrediente({{id}})">Eliminar</a>
   </div>
`
var templateError = `
    <div class="alert alert-danger">
      <strong>Error!</strong> {{mensaje}}
    </div>
`
var templateExito = `
    <div class="alert alert-success">
      <strong>Success!</strong> {{mensaje}}
    </div>
`
//Plantilla Handlebars para renderizar en HTML la lista de la compra
//1. El "." significa el objeto del nivel "actual", en nuestro caso es el array
//por el que vamos a iterar con handlebars
//2. El ${} nos permite interpolar variables (funcionalidad de ES6). Es solo por no
//andar concatenando cadenas, esto queda más elegante
var templateLista = `
 <h2>Lista de la compra</h2>
 {{#.}}
   ${templateItem}
 {{/.}}
`

var templateDetalles = `
  <span id="detalles_{{id}}">
    <br />
    <span id="detalles_id">Id: {{id}}</span>
    <span id="detalles_precio">Precio: {{precio}} <span class="glyphicon glyphicon-euro" aria-hidden="true"></span></span>
    <br />
  </span>
`

var templateItemModificar = `
   <div id="div_modificar">
    <strong>Id: {{id}}</strong><br />
    <label for="modificado_nombre">Nombre:</label> <input type="text" id="modificado_nombre" value="{{nombre}}"> <br>
    <label for="modificadoo_precio">Precio:</label> <input type="number" id="modificado_precio" value="{{precio}}"> <br>
    <a id="enlace_{{id}}" href="javascript:handleModificar({{id}})"><span class="glyphicon glyphicon-pencil" aria-hidden="true">Guardar</a>
    <br />
   </div>
`
var templatePaginate = `
  <div id="paginate">
    <a id="primera" href="javascript:paginate({{first}})"><span class="glyphicon glyphicon-fast-backward" aria-hidden="true"></span></a>&nbsp;
    <a id="anterior" href="javascript:paginate({{prev}})"><span class="glyphicon glyphicon-backward" aria-hidden="true"></span></a>&nbsp;
    <a id="siguiente" href="javascript:paginate({{next}})"><span class="glyphicon glyphicon-forward" aria-hidden="true"></span></a>&nbsp;
    <a id="ultima" href="javascript:paginate({{last}})"><span class="glyphicon glyphicon-fast-forward aria-hidden="true"></span></a>&nbsp;
  </div>
`



//Compilamos las plantillas handlebars. Esto genera funciones a las que llamaremos luego
var tmpl_lista_compilada = handlebars.compile(templateLista)
var tmpl_item_compilada = handlebars.compile(templateItem)
var tmpl_detalles_compilada = handlebars.compile(templateDetalles)
var tmpl_modificar_compilada = handlebars.compile(templateItemModificar)
var tmpl_paginate_compilada = handlebars.compile(templatePaginate)
var tmpl_error_compilada = handlebars.compile(templateError)
var tmpl_exito_compilada = handlebars.compile(templateExito)

//manejador de eventos para cuando se carga la página
//le pedimos la lista de items al servidor y la pintamos en el HTML
document.addEventListener('DOMContentLoaded', function(){
	console.log("Página cargada!: " +  new Date().toLocaleString())
	APILista.obtenerItems('').then(function(datos) {
		//mezclamos los datos con el HTML de la plantilla para obtener el HTML resultado
		var listaHTML = tmpl_lista_compilada(datos.ingredientes)
    var paginas = {}
    paginas.first = datos._links.first.substring(datos._links.first.lastIndexOf('=')+1,datos._links.first.length);
    if(datos._links.next!=undefined) paginas.next = datos._links.next.substring(datos._links.next.lastIndexOf('=')+1,datos._links.next.length);
    if(datos._links.prev!=undefined) paginas.prev = datos._links.prev.substring(datos._links.prev.lastIndexOf('=')+1,datos._links.prev.length);
    paginas.last = datos._links.last.substring(datos._links.last.lastIndexOf('=')+1,datos._links.last.length);

    var paginate = tmpl_paginate_compilada(paginas)
		//insertamos el HTML en la página
		document.getElementById("miComponente").innerHTML = listaHTML
    document.getElementById("miComponente").innerHTML += paginate
	})
})

//manejador de eventos para el botón de "Añadir" item a la lista
document.getElementById('boton_add_item').addEventListener('click', function(){
   //Creamos un objeto JS con los datos del nuevo item
   var nuevo = {}
   nuevo.nombre = document.getElementById('nuevo_nombre').value
   nuevo.precio = document.getElementById('nuevo_precio').value
   //Enviamos el objeto al servidor, usando el API
   APILista.addItem(nuevo).then(function(){
     APILista.obtenerItems('').then(function(datos){
       var listaHTML = tmpl_lista_compilada(datos.ingredientes)
       var paginas = {}
       console.log(datos._links)
       paginas.first = datos._links.first.substring(datos._links.first.lastIndexOf('=')+1,datos._links.first.length);
       if(datos._links.next!=undefined) paginas.next = datos._links.next.substring(datos._links.next.lastIndexOf('=')+1,datos._links.next.length);
       if(datos._links.prev!=undefined) paginas.prev = datos._links.prev.substring(datos._links.prev.lastIndexOf('=')+1,datos._links.prev.length);
       paginas.last = datos._links.last.substring(datos._links.last.lastIndexOf('=')+1,datos._links.last.length);

       var paginate = tmpl_paginate_compilada(paginas)
       //insertamos el HTML en la página
        document.getElementById("miComponente").innerHTML = listaHTML
       document.getElementById("miComponente").innerHTML += paginate
       var mensaje = {}
       mensaje.mensaje = "El ingrediente se ha creado!"
       var exito = tmpl_exito_compilada(mensaje)
       document.getElementById("error").innerHTML=exito;
     });
   })
})

//llamada cuando pulsamos en un enlace "Detalles"
function verDetalles(id) {
	APILista.getItem(id).then(function(item){
		//creamos un objeto JS con los datos de los detalles a mostrar
		var datos = {id: item.id, precio: item.precio}
		//lo fusionamos con la plantilla handlebars
		var datosHTML = tmpl_detalles_compilada(datos)
		//metemos el HTML resultante en la página
	    //aprovechamos que hemos hecho que el item con un id determinado
	    //esté en el HTML en un div con el mismo id
		var divItem = document.getElementById(id)
		divItem.insertAdjacentHTML('beforeend', datosHTML)
		//TEDIOSO: ahora hay que cambiar el enlace "ver detalles" por uno "ocultar"
		//hemos hecho que el HTML del enlace tenga un id con "enlace_" y el id del item
		var enlaceDetalles = document.getElementById('enlace_'+id)
		//Cambiamos a dónde apunta el enlace
		enlaceDetalles.href = 'javascript:ocultarDetalles('+ id +')'
		//cambiamos el texto del enlace
		enlaceDetalles.innerHTML = 'Ocultar detalles'
	})
}
//llamada cuando pulsamos en un enlace "Modificar"
function modificarIngrediente(id) {
	APILista.getItem(id).then(function(item){
		//creamos un objeto JS con los datos de los detalles a mostrar
		var datos = {id: item.id, nombre: item.nombre, precio: item.precio}
		//lo fusionamos con la plantilla handlebars
		var datosHTML = tmpl_modificar_compilada(datos)
		//metemos el HTML resultante en la página
	    //aprovechamos que hemos hecho que el item con un id determinado
	    //esté en el HTML en un div con el mismo id
		var divItem = document.getElementById(id)
		divItem.insertAdjacentHTML('beforeend', datosHTML)
    var enlaceDetalles = document.getElementById('enlace_modificar'+id)
    //Cambiamos a dónde apunta el enlace
    enlaceDetalles.href = 'javascript:ocultarModificacion('+ id +')'
    //cambiamos el texto del enlace
    enlaceDetalles.innerHTML = 'Ocultar modificacion'
	})
}
function handleModificar(id){
  var item = {}
  item.nombre = document.getElementById("modificado_nombre").value;
  item.precio = document.getElementById("modificado_precio").value;
  APILista.modificarIngrediente(item,id).then(function(respuesta){
    if(respuesta == true){
      APILista.obtenerItems('').then(function(datos){
        var listaHTML = tmpl_lista_compilada(datos.ingredientes)
        var paginas = {}
        paginas.first = datos._links.first.substring(datos._links.first.lastIndexOf('=')+1,datos._links.first.length);
        if(datos._links.next!=undefined) paginas.next = datos._links.next.substring(datos._links.next.lastIndexOf('=')+1,datos._links.next.length);
        if(datos._links.prev!=undefined) paginas.prev = datos._links.prev.substring(datos._links.prev.lastIndexOf('=')+1,datos._links.prev.length);
        paginas.last = datos._links.last.substring(datos._links.last.lastIndexOf('=')+1,datos._links.last.length);

        var paginate = tmpl_paginate_compilada(paginas)
    		//insertamos el HTML en la página
    		document.getElementById("miComponente").innerHTML = listaHTML
        document.getElementById("miComponente").innerHTML += paginate
        var mensaje = {}
        mensaje.mensaje = "El ingrediente se ha modificado!"
        var exito = tmpl_exito_compilada(mensaje)
        document.getElementById("error").innerHTML=exito;
      });
    }
    else{
      var mensaje = {}
      mensaje.mensaje = "Error: ha fallado la modificacion debes iniciar sesión";
      var error = tmpl_error_compilada(mensaje);
      var div = document.getElementById("error")
      div.innerHTML = error
    }
  });

}
function ocultarModificacion(id){
  var ocultar = document.getElementById('enlace_modificar'+id)
  //Cambiamos a dónde apunta el enlace
  ocultar.href = 'javascript:modificarIngrediente('+ id +')'
  //cambiamos el texto del enlace
  ocultar.innerHTML = 'Modificar'
  document.getElementById('div_modificar').outerHTML=""
}
//llamada cuando pulsamos en un enlace "Eliminar"
function eliminarIngrediente(id) {
	APILista.deleteIngrediente(id).then(function(respuesta){
    if(respuesta == true){
      APILista.obtenerItems('').then(function(datos){
        var listaHTML = tmpl_lista_compilada(datos.ingredientes)
        var paginas = {}
        paginas.first = datos._links.first.substring(datos._links.first.lastIndexOf('=')+1,datos._links.first.length);
        if(datos._links.next!=undefined) paginas.next = datos._links.next.substring(datos._links.next.lastIndexOf('=')+1,datos._links.next.length);
        if(datos._links.prev!=undefined) paginas.prev = datos._links.prev.substring(datos._links.prev.lastIndexOf('=')+1,datos._links.prev.length);
        paginas.last = datos._links.last.substring(datos._links.last.lastIndexOf('=')+1,datos._links.last.length);

        var paginate = tmpl_paginate_compilada(paginas)
    		//insertamos el HTML en la página
    		document.getElementById("miComponente").innerHTML = listaHTML
        document.getElementById("miComponente").innerHTML += paginate
        var mensaje = {}
        mensaje.mensaje = "El ingrediente se ha eliminado!"
        var exito = tmpl_exito_compilada(mensaje)
        document.getElementById("error").innerHTML=exito;
      });
    }
    else{
      var mensaje = {}
      mensaje.mensaje = "Error: ha fallado la eliminacion debes iniciar sesión";
      var error = tmpl_error_compilada(mensaje);
      var div = document.getElementById("error")
      div.innerHTML = error
    }
  });
}
//IMPORTANTE: para que desde la página se pueda llamar a la función,
// la guardamos en el ámbito global (window). Si no, no será visible,
//porque el código del main.js no es visible directamente para el HTML, sino el bundle.js
window.verDetalles = verDetalles
//Nótese que es el único caso en que desde el HTML (un enlace) llamamos a algo de JS
//El resto de casos es al contrario: los manejadores de eventos de antes los hemos
//definido en JS no en el HTML original

//llamada cuando pulsamos en un enlace "Ocultar Detalles"
function ocultarDetalles(id) {
	//forma sencilla de eliminar un fragmento HTML, asignarle la cadena vacía
	//usamos outerHTML porque incluye la propia etiqueta, innerHTML sería solo el contenido
	document.getElementById('detalles_'+id).outerHTML = ''
	//TEDIOSO: volvemos a poner el enlace en modo "mostrar detalles"
	document.getElementById('enlace_'+id).href = 'javascript:verDetalles('+id+')'
	document.getElementById('enlace_'+id).innerHTML = 'Detalles'

}
//hacemos visible ocultarDetalles para el HTML, por lo mismo que con "verDetalles"
window.ocultarDetalles = ocultarDetalles



//manejador de eventos para el botón de "Iniciar sesión"
document.getElementById('boton_iniciar_sesion').addEventListener('click', function(){
  if(localStorage.getItem("Credenciales").length==0){
    var nombre
    var password
    nombre = document.getElementById('usuario_login').value
    password = document.getElementById('password_login').value
    var credenciales = new Buffer(nombre+":"+password).toString('base64');
    APILista.comprobarLogin(credenciales).then(function(respuesta){
      if(respuesta==true){
        localStorage.setItem("Credenciales",credenciales);
        localStorage.setItem("Nombre",nombre);
        var div = document.getElementById('login')

        var button = document.getElementById('boton_iniciar_sesion');
        //Cambiamos a dónde apunta el enlace
        button.value = 'Cerrar sesión'
        button.id = 'boton_cerrar_sesion'

        div.innerHTML = "<h2>"+nombre+"</h2>";
        div.appendChild(button);
        var mensaje = {}
        mensaje.mensaje = "Sesion iniciada!"
        var exito = tmpl_exito_compilada(mensaje)
        document.getElementById("error").innerHTML=exito;
      }
      else{
        var mensaje = {}
        mensaje.mensaje = "Usuario o contraseña incorrectas intentelo de nuevo";
        var error = tmpl_error_compilada(mensaje);
        var div = document.getElementById("error")
        div.innerHTML = error
      }
    })
  }
  else{
    localStorage.setItem("Credenciales","");
    localStorage.setItem("Nombre","");
    location.reload();
  }
})

function paginate(page){
  var url = "/?page="+page
  APILista.obtenerItems(url).then(function(datos){
    //mezclamos los datos con el HTML de la plantilla para obtener el HTML resultado
    var listaHTML = tmpl_lista_compilada(datos.ingredientes)
    var paginas = {}
    paginas.first = datos._links.first.substring(datos._links.first.lastIndexOf('=')+1,datos._links.first.length);
    if(datos._links.next!=undefined) paginas.next = datos._links.next.substring(datos._links.next.lastIndexOf('=')+1,datos._links.next.length);
    if(datos._links.prev!=undefined) paginas.prev = datos._links.prev.substring(datos._links.prev.lastIndexOf('=')+1,datos._links.prev.length);
    paginas.last = datos._links.last.substring(datos._links.last.lastIndexOf('=')+1,datos._links.last.length);

    var paginate = tmpl_paginate_compilada(paginas)
    //insertamos el HTML en la página
    document.getElementById("miComponente").innerHTML = listaHTML
    document.getElementById("miComponente").innerHTML += paginate
  });
}

window.paginate= paginate
window.modificarIngrediente = modificarIngrediente
window.eliminarIngrediente = eliminarIngrediente
window.handleModificar = handleModificar
window.ocultarModificacion = ocultarModificacion
