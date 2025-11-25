[< Regresar](README.md)
---
# Config para Aplicaciones JappN con JrApi
Dentro de las opciones de configuración de JappN para JrApi, tenemos las siguientes:

### nombre:
Hace referencia al nombre del proyecto, nombre que será visible en la pestanña del navegador

### Datos para conexión Rest

* **restServer**:
Dirección del servidor en donde se encuentra el servicio Rest que atenderá las solicitudes Rest.

* **restVersion**: 
Indica la versión del servicio web Rest.

* **restSchema**
Define el esquema de base de datos que se debe consultar.

* **restNamespace**
Indica el namspace o area de trabajo de la aplicacion.

* **restToken**
Opcional, Posee el token de conexión recibido despues de una autenticación o de genera un token estático. Si no existe evaluar la opción restLocalSession.

* **useVersion**
opcional Boleano que especifica si las llamadas Rest utilizarán o no una versión por defecto true

* **restAppID**
Opcional, indica el id de versión de la aplicación, por defecto indefinido.

* **restLocalSession** 
Opcional, boleano que indica si se almacenará el token de forma local para mantener sesiones abiertas, por defecto false.

* **restSuperToken**
En el caso de utilizar multipleas aplicaciones con sesión local, Japp puede mantener el token de cada app por separado, esto es útil en el caso de que el mismo framework se conecte a aplicaciones diferentes y cada app utiliza una api o backend diferente, pero en el caso de que todas las apps utilicen el mismo backend, tener diferentes tokens puede obstruir el acceso automático a otras apps, por lo que, si deseamos poder autenticarnos en una app y aprovechar ese token para otras apps, es necesario activar el super token, esta propiedad permitirá manejar un solo token para todas las apps, es decir que nos podremos loguear una unica vez en cualquier app y podremos cambiar a otra sin inconvenientes.

* **restLevel**
Opcional, indica el nivel de ejecución de las llamadas Rest, en donde 0=consultas a Endpoint Locales dentro del navegador; 1= consulta con el servidor de JappN y 2=consulta con jrApi. Por defecto 2

* **miniServer**
Opcional, modificar solamente si fuera muy necesario, posee la referencia a la dirección del servidor local, por defecto tiene la dirección del servidor que publica a JappN.

* **miniServerPort**
Opcional, indica el número de puerto por el que consultará al servidor local de JappN. Por defecto 3000,

* **mute**
Opcional, boleano que indica si las peticiones Rest deben ser silenciadas, es decir que NO muestren que están cargando. Por defecto false

* **restRef**
Referencia HTML, en el caso que se desee cargar información direcatmente dentro de un elemento HTML ya existente en el DOM, ver (rest.Lazy - pendiente de programar)


## Origen de objeto de configuración
El objeto de configuración, puede ser proporcionado a la Libreria Rest de diversas formas, en donde una o todas pueden estar estrechamente ligadas. Estos orígenes son:

1. [ archivo ] /js/Config.tsx
2. [ archivo ] /js/vistas/bin/env.tsx
3. [ objeto ] json con las llaves y valores de cinfiguración
4. [ propiedad ] modificar las propiedades de la instancia de Rest

Nota: Los valores de cada uno de estos datos son sobre escritos en el orden que se presentan, es decir que Rest leerá los valores de Config.tsx y los de env.tsx y aquellos valores que existan en env.tsx, sobre escribirán a los de config.tsx y de esa manera con el objeto y las propiedades.

## Como utilizar el objeto Rest
Ver archivo de ayuda Rest.md


*[Jesus E. Laynes G.]*

---
[< Regresar](README.md)