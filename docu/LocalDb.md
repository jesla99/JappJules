[< Regresar](README.md)
---

# Base de Datos Local
Un proyecto pocas veces es funcional sin la capa de datos, por lo que JappN para poder atender a esa necesidad y para funcionalidades pequeñas o poyectos pequeños, JappN permite fabricar una base de datos local que almacena los datos en el navegador.

Esta acción permite almacera, editar y borrar datos persistentes; pero hay que tomar en cuenta que, debido a ser datos de navegador, estos serán afectados o eliminados si el navegador elimina la cache de datos.

Otra particularidad de esta base de datos es que, los datos son locales, es decir que, los datos son accesibles solamente para el equipo en donde se esta ejecutando JappN en ese momento.

Esta funcionalidad es muy buena generar un auxiliar al backend y hacer que nuestros proyectos puedan ser funcionales aun sin conexión o para generar cache y acelerar la fluidez del proyecto.

### Configurando Base de Datos
Para configurar la base de datos, JappN necesita accceder a los parametros del dsn (Data Source Name), que hace referencia a los nombres de origen de datos. Este archivo se encuentra en la siguiente ruta:

/js/vistas/bin/dsn.tsx

y en este archivo encontraremos algo similar a la siguiente estructura:

```js
    const dsn={
        dbName:'demo',  //base de datos local
        dbVersion:'1',  //version de la base de datos
        stores:[        //almacenes
            {name:'_schema_', keyPath:'tabla'},  //almacen obligatorio para control de autonumeros de rids de egistros
            {name:'producto', keyPath:'producto_id'},
            {name:'cliente', keyPath:'cliente_id'}
        ]
    }
```

Esta definición proporciona todos los datos que se requieren para manejar registros desde JappN de forma local y persistente. Ahora bien siempre es importante recordar que los datos están relaciona directamente con el navegador y estos serán eliminados al eliminar cache.

Nota importante: en la sección de stores (almacenes), cada registro hace referencia a un almacen y en su definición aparte del nombre del almacen, es necesario especificar un **keyPath**, esta propiedad es muy importante ya que el valor de esta indica cual será la llave primaria o campo de acceso al registro.


### Datos iniciales
En algunos proyectos, según la forma en la que fueron estructurados, en algunos casos se requerirá de algunos datos pre grabados en la base de datos, por lo que para ello se debe modificar la sección **dbInit** del mismo archivo de dsn, de esta manera:

```js
    const dbInit = [   //Arreglo  de registros a insertar
    {  //Registro a insertar
        store:'producto', //almacen a utilizar (sinonimo de tabla)
        data: [     //Datos de los registros
            {nombre:'Producto 1', stock:100},
            {nombre:'Producto 2', stock:10},
            {nombre:'Producto 3', stock:50},
            {nombre:'Producto 4', stock:75}
        ]
    },
    { //registro a insertar
        store:'cliente', //almacen a utilizar (sinonimo de tabla)
        data:[  //Datos de los registros
            {nombre:"- General -"},
            {nombre:"Jesus Laynes"}
        ]
    }
]
```

Tanto los datos de **dsn** como los de **dbInit** son leídos por JappN cada vez que el proyecto inicia realiza las operaciones necesarias para que la base de datos pueda ser empleada en cualquier parte de tu proyecto.

## Datos importantes sobre la base de datos local 
Para entender el funcionamiento de la base de datos local, hay que tener en cuenta los siguientes:

* El almacenamiento local se realiza en el contexto del navegador, no precisamente como cache de navegación, pero la información almacenada si será afecta al momento de eliminar cache. 

* La base de datos local es una base de datos NO SQL y orientada a objetos, es decir que, no existe el concepto de tablas ni registros, en si defecto existen Almacenes y Objetos respectivamente.

* La base de datos trabaja de forma asíncrona, es decir que rompe el flujo normal de un hilo de ejecución secuencial, pero puede en algún momento ser sincrónica si nos apoyamos de la instrucción await de javascript.

## Uso de la Base de Datos Local
Para hacer uso de la base de datos, será necesario importar la librería de control de Bases de Datos en el módulo que se requiera de la sigueinte manera:

```js
    import React from '../libs/MiReact.js'
    import Dbase from '../libs/dBase.js'

    function Mimodulo(props){
        const registros = Dbase.readAll('Productos')
        .then(data=>{
            console.log(data)
        })    
    }

```

Nota: Dbase, que es la instancia que apunta al controlador de Base de Dalos local, posee varias funciones de acceso a los datos y estas funciones son funciones asincronas, es decir que son manejadas como promesas, por lo que es posible utilizarlas acompañadas de la palabra reservada **await**, siempre y cuando la invocación sea hecha desde dentro de una función marcada como asíncrona como **ascyn** 

### Funciones de datos de la Base de Datos Local
Las funciones para manipulación de datos locales son las siguientes:

* [create](#create): Crear un registro en un almacen
* [read](#read): leer un registro de un almacen
* [readAll](#readAll): leer todos los registros de un almacen
* [update](#update): actualizar un registro de un almacen
* [remove](#remove): eliminar un registro de un almacen
* [find](#find): buscar un registri dentro de un almacen
* [kill](#kill): eliminar un registro dentro de un almacen
* [nextno](#nextno): obtener e incrementar el auto número de un almacen

#### Ejemplos de uso de funciones de Base de Datos Local
Cada una de las funciones de manupulación de datos permite ejecutar una función particular, es importante recordar que la base de datos local, es una base de datos noSQL, por lo que los registros no poseen una restricción de columnas.

Todas las funciones de manipulación de bases de datos son funciones asincronas y manejan promesas como resultado de su ejecución; esto es muy importante ya que de ello depende el correcto funcionamiento del trabajo con los datos.


### <a id="create">Función create</a>
Esta función permite agregar un objeto a un almacen que existe, haciendo con ello la equicalencia de crear un registro; ejemplo: 

```js
    import Dbase from '../libs/dBase.js'
    ...
    ...

    alCargar(props){
        const objetoNuevo = {
            nombre: "Jesus Laynes",
            empresa: "Jobsa.gt",
            puesto: "Jefe de desarrollo",
            fechaIngreso: "2009-01-05"
        }

        Dbase.create("empelado", objetoNuevo)
        .then(data=>{
            cosole.log(data)
        })

        return <h1>Hola mundo</h1>
    }
```

### <a id="read">Función read</a>
-- pendiente --

### <a id="readAll">Función readAll</a>
-- pendiente --

### <a id="update">Función update</a>
-- pendiente --

### <a id="remove">Función remove</a>
-- pendiente --

### <a id="find">Función find</a>
-- pendiente --

### <a id="kill">Función kill</a>
-- pendiente --

### <a id="nextno">Función nextno</a>
-- pendiente --

*[Jesus E. Laynes G.]*

---
[< Regresar](README.md)