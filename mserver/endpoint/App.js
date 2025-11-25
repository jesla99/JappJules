const Api =require("../Api.js") 
const fs = require('fs');
const path = require('path');


class App extends Api{
    GET={
        "/App/extensiones":async ($p, $b)=>await this.getExts($p, $b),
        //"/App/:id":async($p, $b)=>await this.getPruebaId($p, $b)
    }

    async getExts($parts, $body){
        const ruta = '../dist/js/vistas/_exts'; 

        const directorios = fs.readdirSync(ruta).filter(file => fs.statSync(path.join(ruta, file)).isDirectory());
        console.log("Directorios encontrados:", directorios);
        return {error:"", res:directorios}
    }

    async getPruebaId($p, $b){ 
        return await this.conn.query("SELECT * FROM Usuario")
    }

    async info(){
        return {error:""}
    }
}

module.exports = App