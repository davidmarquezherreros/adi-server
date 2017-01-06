var React = require('react')
var API_lista = require('./servicios/API')
var EventBus = require('./servicios/EventBus')

var ModificarItemComponente = React.createClass({
    clickModify: function () {
       var modificado = {
           nombre: this.campoNombre.value,
           precio: this.campoPrecio.value,
       }
       API_lista.modificarIngrediente(modificado,this.props.id).then(function(datos){
           EventBus.eventEmitter.emitEvent('modificarItem', [modificado])
       })
    },
    ocultarModificacion: function () {
      this.props.handleOcultarModificacion(this.props.pos)
    },
    render: function () {
        return <div>
            <h4>Modificar item {this.props.nombre}</h4>
            <input type="text" placeholder="Nombre..." defaultValue={this.props.nombre}
                   ref={(campo)=>{this.campoNombre=campo}}/> <br/>
                 <input type="number" placeholder="Precio..." defaultValue={this.props.precio}
                   ref={(campo)=>{this.campoPrecio=campo}}/> <br/>
                 <button onClick={this.clickModify} className="btn btn-primary">Modificar</button>
            <button onClick={this.ocultarModificacion} className="btn btn-primary">Ocultar Modificacion</button>
        </div>
    }
})
module.exports = ModificarItemComponente
