var React = require('react')
var API_lista = require('./servicios/API')
var EventBus = require('./servicios/EventBus')

var NuevoItemComponente = React.createClass({
    clickAdd: function () {
       var nuevo = {
           nombre: this.campoNombre.value,
           precio: this.campoPrecio.value
       }
       API_lista.addItem(nuevo).then(function(datos){
           EventBus.eventEmitter.emitEvent('nuevoItem', [nuevo])
       })
    },
    render: function () {
        return <div>
            <h1>Nuevo ingrediente</h1>
            <input type="text" placeholder="Nombre..."
                   ref={(campo)=>{this.campoNombre=campo}}/> <br/>
                 <input type="number" placeholder="Precio..."
                   ref={(campo)=>{this.campoPrecio=campo}}/> <br/>
            <button onClick={this.clickAdd} className="btn btn-default">Añadir</button>
        </div>
    }
})
module.exports = NuevoItemComponente
