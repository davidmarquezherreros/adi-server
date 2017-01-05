var React = require('react')
var EventBus = require('./servicios/EventBus')
var API_lista = require('./servicios/API')

module.exports = React.createClass({
    verDetalles : function (evento) {
       this.props.handleVerDetalles(this.props.pos)
    },
    delete : function (evento){
      API_lista.deleteIngrediente(this.props.id).then(function(datos){
          EventBus.eventEmitter.emitEvent('borrarItem')
      })
    },
    verModificacion : function (evento) {
       this.props.handleVerModificacion(this.props.pos)
    },
    render: function () {
        return <div className="item">
               <span className="nombre">{this.props.nombre}
               </span>&nbsp;
               <span className="detalles">
               <a href="#" onClick={this.verDetalles}>Detalles</a>
               </span>&nbsp;
               <span className="modificar">
               <a href="#" onClick={this.verModificacion}>Modificar</a>
               </span>&nbsp;
              <span className="borrar">
              <a href="#" onClick={this.delete}>Borrar</a>
              </span>
               </div>
    }
})
