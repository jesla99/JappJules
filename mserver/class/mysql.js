var mysql = require('mysql');

class db{
    connection
    callback
    constructor(server, cb){
        this.callback = cb;
        this.connection = mysql.createConnection({
            host     : server.host,
            user     : server.user,
            password : server.password,
            database : server.database,
            port     :server.port
        });

    }

    query(sql){
        return new Promise(bien=>{
            this.connection.query(sql, (error, results, fields)=>{
                if (error) bien({error:error});
                else bien({error:'', res:results})
            })
        })
    }
}

module.exports = db