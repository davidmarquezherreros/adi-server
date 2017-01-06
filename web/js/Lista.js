var React = require('react')
var Item = require('./Item')
var DetallesItem = require('./DetallesItem')
var API_lista = require('./servicios/API')
var EventBus = require('./servicios/EventBus')
var ModificarItem = require('./ModificarItem')


module.exports = React.createClass({
    componentDidMount: function () {
        //escuchamos el evento 'nuevoItem' en el bus de eventos
        //si se recibe el evento hay que añadir el item a la lista
        EventBus.eventEmitter.addListener('nuevoItem', this.refrescarItems)
        EventBus.eventEmitter.addListener('borrarItem', this.refrescarItems)
        EventBus.eventEmitter.addListener('modificarItem', this.refrescarItems)
        //le pedimos los items al API
        this.refrescarItems()
    },
    getInitialState : function () {
      return {items:[]}
    },
    verModificacion: function (i) {
       this.setState({modifica:i})
    },
    ocultarModificacion: function () {
       this.setState({modifica:undefined})
    },
    refrescarItems: function () {
        API_lista.obtenerItems('')
            .then(datos => {
                this.setState({items: datos})
            })
    },
    verDetalles: function (i) {
       this.setState({detalle:i})
    },
    ocultarDetalles: function () {
       this.setState({detalle:undefined})
    },
    paginatePrimera: function(){
      var url = this.state.items._links.first
      var page = url.substring(url.lastIndexOf('/'),url.length);
      API_lista.obtenerItems(page)
          .then(datos => {
              this.setState({items: datos})
          })
    },
    paginateSiguiente: function(){
      if(this.state.items._links.next != undefined){
        var url = this.state.items._links.next
        var page = url.substring(url.lastIndexOf('/'),url.length);
        API_lista.obtenerItems(page)
            .then(datos => {
                this.setState({items: datos})
            })
      }
    },
    paginateAnterior: function(){
      if(this.state.items._links.prev != undefined){
        var url = this.state.items._links.prev
        var page = url.substring(url.lastIndexOf('/'),url.length);
        API_lista.obtenerItems(page)
            .then(datos => {
                this.setState({items: datos})
            })
      }
    },
    paginateUltima: function(){
      var url = this.state.items._links.last
      var page = url.substring(url.lastIndexOf('/'),url.length);
      API_lista.obtenerItems(page)
          .then(datos => {
              this.setState({items: datos})
          })
    },
    delete:function(i){
      API_lista.deleteIngrediente(this.state.items.ingredientes[i].id);
    },
    verModificacion: function (i) {
       this.setState({modifica:i})
    },
    ocultarModificacion: function () {
       this.setState({modifica:undefined})
    },
    render: function () {
        var prods = []

        if(this.state.items.ingredientes != undefined){
          for (var i=0; i<this.state.items.ingredientes.length; i++) {
              var actual = this.state.items.ingredientes[i]
              var elemento
              if (this.state.detalle==i) {
                  elemento = <DetallesItem key={i}
                                       pos={i}
                                       nombre={actual.nombre}
                                       precio={actual.precio}
                                       id={actual.id}
                                       handleOcultarDetalles={this.ocultarDetalles}/>
              }
              else if(this.state.modifica==i){
                elemento = <ModificarItem key={i}
                                     pos={i}
                                     nombre={actual.nombre}
                                     precio={actual.precio}
                                     id={actual.id}
                                     handleOcultarModificacion={this.ocultarModificacion}/>
              }
              else {
                  elemento = <Item key={i}
                                   pos={i}
                                   nombre={actual.nombre}
                                   id={actual.id}
                                   handleVerDetalles={this.verDetalles}
                                   handledelete={this.delete}
                                   handleVerModificacion={this.verModificacion}/>
              }
              prods.push(elemento)
          }
          return <div id="lista">
                    <h1>Ingredientes</h1>
                    {prods}

                    <a href="#" onClick={this.paginatePrimera}>Primera</a>&nbsp;&nbsp;
                    <a href="#" onClick={this.paginateSiguiente}>Siguiente</a>&nbsp;&nbsp;
                    <a href="#" onClick={this.paginateAnterior}>Anterior</a>&nbsp;&nbsp;
                    <a href="#" onClick={this.paginateUltima}>Ultima</a>
                 </div>
        }
        else{
          return <div id="lista">
                    <h1>Ingredientes</h1>
                      <h2> No hay ingredientes</h2>
                 </div>
        }
    }
})
