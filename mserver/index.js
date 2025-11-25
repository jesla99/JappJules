/**
 * Servidor de miniserver, pendiente Clusterizarlo para mejorar la prestación del servicio.
 */
const db = require("./class/mysql.js")
const http = require('http');
const url = require('url');
const fs = require('fs');
const param = require('./class/Config.js');


const PORT = param.restPort;

const conn = new db({
    host:param.host,
    user:param.user,
    password:param.password,
    database:param.database,
    port:param.port
})

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    
    const parsedUrl = url.parse(req.url, true);
    const method = req.method;
    const headers = req.headers;
    const token = headers['token'];

    const partes = parsedUrl.pathname.split("/")
    const endpoint = partes[1]
    
    if (token == undefined) {
        res.end('{error:"Token inválido."}')
        return
    }

    if (token.indexOf("'") != -1 || token.indexOf("=") != -1){
        res.end('{error:"Caracteres en token inválidos."}')
        return
    }

   conn.query("SELECT * FROM token WHERE token='"+ token +"'")  
   .then(data=>{
    if (data.error!=""){
      res.end(JSON.stringify(data))  
    } else {
        if (data.res.length==0) {
            res.end('{"error":"Token inválido."}')
        } else {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', async () => {
                if(body=="") body = "{}"
                res.setHeader('Content-Type', 'application/json');

                if (fs.existsSync(__dirname +'/endpoint/'+endpoint+'.js')) {
                    const modulo = require(__dirname +'/endpoint/'+endpoint+'.js')
                    const app = new modulo(conn)
                    
                    if (typeof body == "string") body=JSON.parse(body)
                    if (parsedUrl.search != null) {
                        const searchString = parsedUrl.search;
                        const params = new URLSearchParams(searchString.slice(1));
                        const queryObjeto = Object.fromEntries(params.entries());
                        for(let i in queryObjeto)
                            body[i]=queryObjeto[i]
                    }

                    const retorno = await app.run(method, parsedUrl.pathname, body)
                    res.end(JSON.stringify(retorno))
                } else {
                    res.end('{"error":"El endpoint '+ endpoint+' no existe"}')
                }
            })
        }
    }
  });
})

server.listen(PORT, () => {
    console.log(`Api nivel 1 corriendo en http://localhost:${PORT}/`);
})
