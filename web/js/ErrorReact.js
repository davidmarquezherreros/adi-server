var React = require('react')
var API = require('./servicios/API')
var EventBus = require('./servicios/EventBus')

var ErrorComponente = React.createClass({
    getInitialState : function () {
      return {mensaje: ''}
    },
    componentDidMount: function() { // Se llama despues de renderizar
      localStorage.setItem("ErrorReact","");
    },
    error: function () {
      var aux_mensaje = localStorage.getItem("ErrorReact");
      this.setState({mensaje: aux_mensaje})
    },
    render: function () {
          if(localStorage.getItem("ErrorReact")!=""){
            return (
              <div>
                <a href="#" onClick={this.error}>Ver error</a>
                <div className="alert alert-danger">
                <strong>Error!</strong> {this.state.mensaje}
                </div>
              </div>
            );
          }
          else{
            return (<div className=""></div>);
          }
    }
})
module.exports = ErrorComponente
