[< Regresar](Indice.md)

---
# Sockets

Japp-N actualmente posee un tipo de sockets implementado, pero se espera que, conforme el framework madure, pueda contar con mas de un tipo de conexión por medio de sockets. 

Como contexto, es importante recordar que los sockets elaboran una especie de tunel de comunicación entre dos equipos dentro de una red, enviando información bidireccional, es decir que es posible enviar en cualqueir momento información entre los equipos que poseen una conexión por medio de sockets. 

## Cómo funcionan los Sockets en Japp-N
Japp-N desde la versión del 23 de febrero del 2025, implementa el trabajo con sockets, utilizando inicialmente un único tipo de sockets y que en esta ocación es un socket punto a punto, es decir que, para hacer uso de este tipo de comunicación NO requermis de un servidor de negociación.

La particularidad de este tipo de sockets es que, estan diseñados para establecer comunicación entre dos equipos o en este caso dos equipos que estén ejecutando una instancia de Japp-N; una de las desventajas de este tipo de sockets es que, estan diseñados para conectar 2 puntos, por lo que, si un equipo quiere tener comunicación con mas de un punto, será necesario tener un socket para cada equipo con el que desea establecer comunicación.

Sabiendo esto, podemos iniciar a definir a dos tipos de instancia de Japp-N (haciendo referencia al concepto de comunicación p2p), la instancia de Japp-N Servidor y la instancia de Japp-N cliente. 

### Instancia Japp-N Servidor. 
Esta instancia es configuraca para tener N número de sockets, y es esta instancia quién define tanto el número como el nombre de cada uno de los puntos de conexión por medio de sockets, esta definición se realiza en el archivo /src/js/vistas/bin/env.tsx, dentro de este archivo se debe buscar la directiva que hace referencia a *nSockets*.

```js
    export const nsockets=[]
```
Es en éste lugar en donde se define cada uno de los sockets, como se observa, nsockets hace referencia al número de sockets que Japp-N tendrá, esto es un arreglo de nombres que serán utilizados como ID de socket.

```js
    export const nsockets=["socket1", "pcCarlos", "equipoInvitado"]
```
En el ejemplo anterior, se define una instancia de Japp-N como servidor de sockets con 3 sockets disponibles. Es importante mencionar que la gestión de sockets NO es una gestión dinámica, pero se espera que a versiones futuras si sea posible gestionar de forma dinámica.

### Instancia Japp-N Cliente.
La configuración de una instancia de Japp-N como cliente, es una acción que debe ser realizada en el archivo env.tsx que se encuentra en /src/js/vistas/bin en donde se define el nombre del socket al que Japp-N se conectará.

```js
    export const miSocket = "pcCarlos"
```
En el ejemplo anterior, una instancia de Japp-N configurada como cliente, buscará aun socket previamente creado en la instancia Japp-N server, con el nombre de pcCarlos y si ese socket esta desocupado, realizará una conexión.

Nota: al igual que los sockets de una instancia Japp-N tipo servidor, la creación y conexión de sockets no es de forma dinámica, pero se espera que a futuras versiones del framework, esto sea posible.

Nota: En este tipo de sockets y por la arquitectura que se decidió implementar, la comunicación es posible entre cualquier instancia cliente y el servidor; ahora bien, evitando la comunicación entre clientes; esto debido a que, la intención es poder brindar un escenario en donde, en una red interna, una instancia de Japp-N pueda centralizar la infomación de un pequeño sistema en red.

Nota importante: La implementación de este tipo de sockets, fué pensada y programada para ser funcional en redes fisica y lógicamente en la misma capa o segmento, aunque el protocolo de comunicación empleado soporta enrutamientos, el fin para el que está diseñado, garantiza el funcionamiento solamente en redes locales.

### Reconeción en caso de desconección.
Es importante aclarar que la implementación de sockets esta en versión beta, por lo que aun puede presentar problemas en reconexión y que esta funcionalidad se espera que sea 100% transparente.

## Uso de sockets
Después de configurar cada una de las instancias de Japp-N, es necesario saber como enviar y como recibir mensajes, para ellos es necesario acceder a los siguientes recursos: 

* [Socket Enviar](SocketEnviar.md) 
* [Evento alSocket](AlSocket)  

---
[< Regresar](Indice.md)
