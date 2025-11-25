[< Regresar](Indice.md)

---
# Socket Enviar
Funcion de JappN en versión BETA que se encarga de establecer comunicación entre dos instancias de Japp-N que corran en diferentes equipos de la misma red física y lógica. es necesario aclarar que ambos equipos deben estar en la misma red física, ya que el socket no está programado para poder utilizar enrutamientos entre redes físicas ni lógicas. 


Se asume que cada una de las instancias de Japp-N están configuradas correctamente según las especificaciones contenidas en Sockets.

Si lo anterior se cumple, enviar comunicación por medio de sockets de Japp-N es muy simple, para ellos se utilizará el objeto [**socket**](Sockets.md) disponible en todo tipo de módulo, de la siguiente manera:

```js
    alCargado(el, props){
        socket.enviar("Hola, ya cargué")
    }
```

Nota: Recordando que una instancia de Japp-N puede poseer un socket tipo cliente o uno tipo servidor, el ejemplo asume que se está trabajando en una instancia de Japp-N con un socket cliente y que está enviando el mensaje a un Japp-N configurado como servidor.

En el caso de tratarse de una instancia de Japp-N configurada como servidor:

```js
    alCargado(el, props){
        socket.eviar("Hola, saludos desde el server", "socket2")
    }
```

Nota: En este caso, el envío requiere un argumento extra que, hace referencia al socket por el cual la comunicación será enviada.



---
[< Regresar](Indice.md)
