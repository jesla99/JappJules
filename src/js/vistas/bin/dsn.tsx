const dsn={
    dbName:'demo',  //base de datos local
    dbVersion:'1',  //version de la base de datos
    stores:[        //almacenes
        {name:'_schema_', keyPath:'tabla'},  //almacen obligatorio
        {name:'_cache', keyPath:'_cache_id'},  
        {name:'producto', keyPath:'producto_id'},
        {name:'cliente', keyPath:'cliente_id'}
    ]
}
export default dsn

//datos iniciales de la base de datos
const dbInit = [
    {
        store:'producto', 
        data: [
            {nombre:'Producto 1', stock:100},
            {nombre:'Producto 2', stock:10},
            {nombre:'Producto 3', stock:50},
            {nombre:'Producto 4', stock:75}
        ]
    },
    {
        store:'_cache',
        data:[
            {verbo:"GET", endpoint:"/Usuario/1", response:{error:"", res:[]}, tablas:[1,2]}
        ]
    },
    {
        store:'cliente',
        data:[
            {nombre:"- General -"},
            {nombre:"Jesus Laynes"}
        ]
    }
]
export {dbInit}