var React = require('react')

module.exports = React.createClass({
    ocultarDetalles: function () {
      this.props.handleOcultarDetalles(this.props.pos)
    },
    render: function () {
        return <div className="detallesItem">
              <span className="nombre">{this.props.nombre}</span>&nbsp;-&nbsp;
              <span className="precio">Precio: {this.props.precio} <span className="glyphicon glyphicon-euro" aria-hidden="true"></span></span>&nbsp;
              <span className="id">Id: {this.props.id}</span>&nbsp;&nbsp;
              <a href="#" onClick={this.ocultarDetalles}>Ocultar detalles</a>
            </div>
    }
})
