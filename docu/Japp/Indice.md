[Regresar a Menu principal](../README.md)

---
# Eventos, propiedades y Funciones Japp

 ## Eventos
* [**alCargar**](AlCargar.md):  

* [**alCargado**](AlCargado.md):  

* [**alCerrar**](AlCerrar.md): 

* **alBloquear**:      
(pendoiente de programar) evento que debe lanzarse al momento de que un modulo sea bloqueado

* **alDesbloquear**:  
(pendiente de programar) evento que debe lanzarse al momento de que un modulo sea des bloqueado

* **alEnfoque**:     
(pendiente de programar) evento que deberia lanzarse cuando se pierda el enfoque del elemento que renderizó el módulo

* **alDesEnfoque**:  
(pendiente de programar) Evento que debe ejecutarse al desenfocar el elemento que renderizó el módulo

* [**alRecibir**](AlRecibir.md):    

* [**alSocket**](AlSocket.md):    

* **alMandado** 
(pendiente de programar) evento que se debe lanzar al haber notificado a todos los modulos de la rama a la que se envió un mensaje

* [**alHilo**](AlHilo.md)  

* [**Eventos Públicos**](EventosPublicos) 
Usar solo en casos muy específicos por su alto riezgo y falta de seguridad. 

## Propiedades
* id:  Identificador unico, por defecto esta vacío. Un ID es necesario si desea [**enviar**](../Japp/Enviar.md) mensajes directamente a un módulo en particular.

* **nombre**: El nombre del módulo se define automáticamente al momento de ser construido y es empleado para poder hacer [envío](../Japp/Enviar.md) de mensajes a un grupo de elementos contruidos con el mismo módulo.  

* **el**: 
Propiedad que contiene referencia al Elemento Html que fué construido por el módulo.

* **bin**:      
Propiedad opcional que puede tener referencia a un contexto que no es precisamente el módulo desde el que se construyó.

* **nodos**:    
Referencia a todos los módulos que fueron invocados a partir del modulo actual

* [**estado**](Estados.md):
Propiedad que indica el estado del módulo ejecutado. 

* parent:    
Refernencia al contexto de módulo desde el cual fue cargado el módulo actual. 

* **estado**:   
Identificador de estados, cadena de texto que permite definir el estado del componente, es utilizado para saber en que estado esta el módulo, en el caso de haber ocurrido un error durante la carga y el módulo no logró cargar satisfactoriamente, el módulo podría tener el estado de cargando.

Los estados disponibles están contenidos en: 
this.arrEstadoError y this.arrEstadoOk


* notificado:  
tiempo de bloqueo en milisegundosm despues de ser notificado de un mensaje entrante, mensaje enviado por [this.enviar](../Japp/Enviar.md) 

* _keys:    
Propiedad que posee un arreglo de [teclas cortas](../TeclasCortas.md) que estarán activas en el módulo que fueron definidas 

* \$:        
Acceso a las [funciones de dolar](../$/Indice.md), clone muy reducido de la funcionalidad de JQuery (r)

 -- Pendiente de documentar, funcionalidades existentes --
 ## Funciones
 * [Cargar](Cargar.md):  
 Forma correcta de cargar vistas y módulos en tiempo de ejecución.

 * addCss:  
 (pendiente de migrar desde jappM) cargar una hoja de estilos al proyecto

 * getCampos:  
 Serializar todos los campos tipo tarjeta (campos de componentes tipo tool)

 * e:       
 Manejador de errores de JappN

 * isMobile:  
 Validar si el navegador esta corriendo en un dispositivo movil

 * Dialogo:  
 Fabrica un dialogo o ventana modal

 * Ventana: 
 (pendiente de migrar de JappM) Fabrica una ventana sobrepuesta

 * toRes:   
 Convierte un objeto oRes a un objeto Res

 * toORest: 
 (Pendiente de programar) Debe convertir un resultado Rest a oRest

 * Drager:
   {clase} Permite hacer elementos arrastrables

 * getRoot:  
 Permite buscar el tronco del arbol del elemento 

 * [enviar](Enviar.md):  
 Envía mensajes entre modulos, (solo falta programar propagar a tronco)  
 
 * [socket.enviar](SocketEnviar.md): 
 Envía un mensaje por medio de sockets P2P entre instancias de Japp-N

 ## Funciones React
 * [app.css / _estilo / jcss](Estilos.md):  
Incluye estilos CSS dentro de mi aplicación.

* [ _permiso ](Permisos.md): 
Asigna permisos de acceso a vistas o elementos.

## Micelaneos
* [Variables Globales](VariablesGlobales.md)




*[Jesus E. Laynes G.]*

---
[Regresar a Menu principal](../README.md)
