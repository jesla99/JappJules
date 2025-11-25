[< Regresar](README.md)
---
# Rest
Permite tener acceso a un backen o servidor remoto y posee también una funcionalidad de backend de respaldo, que permite enrutar las peticiones a un backend local dentro del mismo JappN, usando el backend local como respaldo en el caso de falta de conexión con el server remoto.


## Uso:
Para hacer uso básico del objeto Rest, es necesario importar la librería Rest y crear una instancia del mismo; en su forma mas simple sería de la siguiente manera:

```js
    ...
    //importación del objeto
    import Rest from "../libs/Rest.js"

    //creación de una instancia tomando el objeto de conexión por defecto /js/Config.js
    const miRest = new Rest();

    //Consulta asincrona de un endpoint 
    miRest.get("/elEndpoint")
    .then(data=>{
        //respuesta asincrona del endpoint
        console.log(data)
    })

    //Consulta sincrona de un endpoint 
    const data = await miRest.get("/elEndpoint")
    console.log(data)
    ...

```

### Usando valores de env.tsx
env.tsx es una de las formas de configurar la instancia Rest, para ello se utiliza un archivo que se encuentra en /js/vistas/bin/env.tsx de la siguiente manera.

```js
    //construimos una instancia indicando que utilizaremos parametros de request superiores (los de la aplicación en env.tsx)
    const miRest = new Rest({superReq:true});

    //Consulta asincrona de un endpoint 
    miRest.get("/elEndpoint")
    .then(data=>{
        //respuesta asincrona del endpoint
        console.log(data)
    })

```
En el ejemplo anterior, Rest tomara los datos de configuración General de /js/Congif.tsx y leerá también los de env.tsx, sobre escribiendo los valores de config.tsx con aquellos que coincidan con los de env.tsx

### Usando valores desde un objeto de configuración
En este caso, los datos de configuración se envían en un objeto de configuracion (json) como parámetro en la construcción de la instancia Rest.

```js
    //construimos el objeto de configuración)
    const config = {
        restToken: "01239102",
        restVersion: "v2",
    }


    const miRest = new Rest(config);

    //Consulta asincrona de un endpoint 
    miRest.get("/elEndpoint")
    .then(data=>{
        //respuesta asincrona del endpoint
        console.log(data)
    })

```
En el ejemplo anterior, se contruye la instancia rest con los valores de Config.tsx y se sobre escriben con los valores del objeto config. Nota: si en el objeto de configuración se incluye superReq:true, entonces se incluye el archivo env.tsx sobre escribiendo a config.tsx y el objeto json sobre escribiendo a env.tsx

### Usando propiedades para modificar configuración
Cuando una instancia de Rest ya existe sin importar como se configuró, es posible modificar parte de la configuración accediendo por las propiedades del objeto de la siguiente manera.

```js
    //Creamos la instancia de rest
    const miRest = new Rest({superReq:true});

    const usuario = miRest.get("/Usuario")

    //cambiamos la versión de consulta de endpoint
    miRest.restVersion = "v2"
    const permisos = miRest.get("/Usuario/permiso")

```
En este ejemplo, la solicitud GET a /Usuario se realiza a la versión configurada al contruir la instancia, pero por medio de miRest.restVersion, cambiamos la versión a v2 de manera que, /Usuario/permiso ya no se consulta al endpoint de la version v1 de /Usuario sino que a la versión 2 del mismo endpoint.

## Funciones Rest
-- Pendiente de documentar --

## Función Lazy
-- Pendiente de documentar --

## Función LazyRender
-- Pendiente de documentar --

## Función SuperToken
-- Pendiente de documentar --

## Cerrar Sesion
rest.cerrarSesion ()

*[Jesus E. Laynes G.]*

---
[< Regresar](README.md)