var React = require('react')
var ReactDOM = require('react-dom')

var Lista = require('./Lista')
var NuevoItem = require('./NuevoItem')
var Sesion = require('./Sesion')


ReactDOM.render(<Sesion/>,
    document.getElementById('componenteSesion'))
ReactDOM.render(<Lista tamPagina="5"/>,
    document.getElementById('componenteLista'))
ReactDOM.render(<NuevoItem/>,
    document.getElementById('componenteNuevoItem'))
