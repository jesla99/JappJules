[< Regresar](../Indice.md)

---
# Dialogo
Este módulo fabrica una ventana de dialogo para JappN, dentro de las características de esta funcionalidad está, presentarse de forma flotante sobre la ventana actual, respentando todos los elementos renderizados en el nodo raíz, permitiendo visualizar nuevas funcionalidades que pueden de alguna manera interactuar con los elementos ya renderizados, pero al mismo tiempo pudiendo ser completamente aislados.

Es importante mencionar también que, cuando un dialogo se renderiza en pantalla, coloca un elemento de bloqueo que evita presionar click sobre los elementos que están fuera del dialogo, además in habilita las teclas cortas de los módulos ya renderizados y habilita las teclas cortas del módulo renderizado dentro del dialogo.

### Propiedades

* **bin**: contexto o referencia del módulo que va a recibir las acciones de los botones, si omite y el mensaje es una clase o clase JappN, el bin (contexto) será la clase, si se enví un string, el contesto no sera definido y se buscar un callBack. 

* botones: objeto de nombres de botón, en el caso de no existir contexto de retorno y existir un callBack, al callBack se evciará el valor que posea la definición del boton. 

* titulo: Título de la ventana de dialogo. 

* mensaje: Contenido del dialogo puede ser uno de estos valores string | html | clase | clase jappn. 

* vprops: propiedades que pueden ser necesarias en el caso de enviar un mensaje tipo clase o clase JappN. 

* btClass //estilo para los botones (pendiente de validar) 

* win:  Clase css para la ventana ("full" para pantalla completa) 

* bin: Opción para enviar contexto que retorna como parámetro de callBack

* callBack: funcion de retorno en caso de no desea usar el contexto, dentro del retorno se devuele el valor que se colocó en la definicion del objeto de botones.





*[Jesus Laynes]*
---

[< Regresar](../Indice.md)