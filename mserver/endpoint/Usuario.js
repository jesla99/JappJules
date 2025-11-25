const Api =require("../Api.js") 

class Usuario extends Api{
    GET={
        "/Usuario/apps":async ($p, $b)=>await this.getApps($p, $b),
        //"/App/:id":async($p, $b)=>await this.getPruebaId($p, $b)
    }

    POST={}

    async getApps($parts, $body){        
        return {error:"", 
        res:[
            {app_id: 1, nombre: 'BCommerce'},
            {app_id: 2, nombre: 'BCommerce2'}
        ]}
    }

}

module.exports = Usuario