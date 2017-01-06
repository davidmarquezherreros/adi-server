
module.exports  = {
    API_URL : 'http://localhost:3000/ingredientes',
    obtenerItems: function (url) {
        return fetch(this.API_URL+url)
            .then(function(response) {
                if (response.ok)
                    return response.json()
            })
    },
    addItem: function (item) {
        return fetch(this.API_URL, {
                   method: 'POST',
                   headers: {
                       'Content-type':'application/json',
                       'Authorization':'Basic '+localStorage.getItem("Credenciales")
                   },
                   body: JSON.stringify(item)
               }).then(function (respuesta) {
                   if (respuesta.ok){
                      return respuesta.ok()
                    }
               })
    },
    comprobarLogin: function(login){
      return fetch('http://localhost:3000/login', {
                        headers: {
                             'Authorization':'Basic '+login
                         },
                       })
          .then(function(response) {
              if (response.ok)
                  return response.ok
          })
    },
    deleteIngrediente: function(pos){
      return fetch(this.API_URL+'/'+pos,{
        method: 'DELETE',
        headers:{
          'Authorization':'Basic '+localStorage.getItem("Credenciales")
        }
      }).then(function(respuesta){
        if(respuesta.ok){
          return respuesta.ok;
        }
      })
    },
    modificarIngrediente: function (item,id) {
        return fetch(this.API_URL+"/"+id, {
                   method: 'PUT',
                   headers: {
                       'Authorization':'Basic '+localStorage.getItem("Credenciales"),
                       'Content-type':'application/json'
                   },
                   body: JSON.stringify(item)
               }).then(function (respuesta) {
                   if (respuesta.ok)
                      return respuesta.ok
               })
    },
    getItem: function(id) {
       return fetch(this.API_URL+'/'+id)
            .then(function(response) {
                if (response.ok)
                    return response.json()
            })
    }

}
