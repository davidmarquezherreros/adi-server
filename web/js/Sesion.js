var React = require('react')
var API = require('./servicios/API')
var EventBus = require('./servicios/EventBus')
var ErrorReact = require('./ErrorReact')

var SesionComponente = React.createClass({
    getInitialState : function () {
      return {nombre: ''}
    },
    clickAdd: function () {
       var login = {
           usuario: this.campoUsuario.value,
           password: this.campoPassword.value
       }
       var envio = new Buffer(login.usuario+":"+login.password).toString('base64')
       API.comprobarLogin(envio).then(function(ok){
         if(ok==true){
           localStorage.setItem("Credenciales", envio);
           localStorage.setItem("Nombre", login.usuario);
           localStorage.setItem("ErrorReact","");
         }
         else{
           localStorage.setItem("ErrorReact","Usuario/Contraseña incorrecta intentelo de nuevo!");
         }
       })
       this.setState({nombre: login.usuario});
    },
    logout: function () {
      localStorage.setItem("Credenciales", "");
      localStorage.setItem("Nombre", "");
      this.setState({nombre: ''});

    },
    render: function () {
          if(localStorage.getItem("Credenciales")==""){
          return (
              <div>
                <legend>Iniciar sesión</legend>
                  <input type="text" placeholder="Usuario..."
                     ref={(campo)=>{this.campoUsuario=campo}}/> <br/>
                   <input type="password" placeholder="Password..."
                     ref={(campo)=>{this.campoPassword=campo}}/> <br/>
                   <button onClick={this.clickAdd} className="btn btn-primary">Iniciar sesión</button>
                   <ErrorReact />
              </div>
              );
        }
        else{
          return (
            <div>
              <h1>
                {localStorage.getItem("Nombre")}
              </h1>
              <a href="#" onClick={this.logout}>Cerrar sesión</a>
              </div>
            );
        }
    }
})
module.exports = SesionComponente
