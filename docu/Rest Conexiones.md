# Conexión Rest:

Un objeto de conexión para JappN, es una objeto que tiene las propiedades necesarias para establecer comunicación con el backend hecho en jrApi.

Esta misma estructura es empleada para ser uncluida en el archivo de configuración de JappN.

```javascript
    Objeto:
    {
        //Cadena con la dirección del servidor jrapi
        restServer: "https://miServer.com",
        //Versión del endpoint
        restVersion: "v1",
        //Nombre del espacio de trabajo
        restNamespace: "dev",
        //Esquema de la base de datos
        restSchema: "jrapi",
        //Entero que identifica el id de la aplicación
        restAppID: 2,
        //boleano que indica si se almacenará la sesion localmente
        restLocalSession: true,
        //url de miniserver, si se ignora, por defecto busca el servidor en donde JappN se ejecuta
        miniServer: "http://servidor.com",
        //Indica el puerto por el que se conectará al miniserver
        miniServerPort: 3000,
        //boleano que indica si se usará versiones de api, por defecto true
        useVersion: true,
        //boleano que indica si la consulta debe priorizar la comexion de la aplicación (configuración en archivo .env) por defecto false.
        superReq: false,
        //entero con el nivel de conexion, 0=acceso local(navegador), 1=acceso servidor JappN (miniApi), 2=Acceso a jrApi (por defecto) y 3=Dinamico al fallar intenta consultar en otros servers.
        restLevel: 2,
        //token de conexión, empleado siempre y cuando restLocalSession sea seteado a false
}
```

Nota: Existen 4 formas de configurar una instancia de conexión Rest:

1. Archivo de configuración general: En este caso, el obejto de conexión es parte del archivo de configuración ubicado en /js/Config.js

2. Archivo de configuración de la aplicación: En este otro caso, el objeto de conexión es parte del archivo de configuración de la aplicación, este archivo se encuentra en la ruta /js/vistas/bin/env.tsx

3. Objeto de configuración personalizado: Si por alguna razón es necesario acceder a un servidor diferente durante la ejecución de la aplicación, el objeto REST puede fusionar parámetros de configuración con un objeto con uno o todos los parámetros de conexión. para ellos basta con construir un objeto REST, compartiendo en la construcción un objeto de conexión. ejemplo:
 ```js
    const oConexion = {
         restServer: "https://otroServer.com",
         restLocalSession: false,
         restToken: "99999"
    }

    const rest = new Rest(oConecion)

 ```
 En el ejemplo anterior, el objeto REST se construirá con los parámetros por defecto, sobre escribiendo los 3 parámetros compartidos en la objeto oConexion.


4. Conexión de la tabla de conexiones desde jrApi: {Aun en desarrollo}


Nota: la conexión por defecto SIEMPRE será tomada en cuenta por el objeto Rest, pero sus propiedades pueden ser total o parcialmente sobre escritas por los demás medios.

