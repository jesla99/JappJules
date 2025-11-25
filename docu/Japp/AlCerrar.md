[< Regresar](Indice.md)

---
# Evento al Cerrar
Como contexto para entender este evento, es importante recordar que los elementos en pantalla (vista), son creados como resultado de la llamada del evento alCargar de cada módulo tipo clase respectivamente, también es importante mencionar que los módulos después de construir el elemento de pantalla, pueden ser indexados en el árbol de nodos de Japp-N (ver árbol de nodos).

Bajo el contexto anterior, el evento **alCerrar** tiene como finalidad, ejecutar validaciones u operaciones de datos que necesiten ser procesados ANTES de eliminar el elemento HTML en pantlla y eliminar el nodo tipo módulo del árbol de nodos de Japp-N.

Nota Importante: Para que el evento alCerrar funcione correctamente, es necesario que el módulo existe en el árbol de nodos de Japp-N y que el elemento HTML esté siendo remplazado por la función **React.Cargar** o **this.Cargar**.

El evento alCerrar NO recibe argumentos y de existir debe devolver una respuesta que inndique si existe o no un error que evite cerrar el módulo y si debe ser o no notificado dicho error, con un objeto similar al siguiente:
```json
{
    "error": "",  //error vacio en caso satisfactorio
    "oculto": true  //opcional, oculta la ventana de notificacion por defecto false
}
```

Nota: Para que **React.Cargar** o **This.Cargar** sea capaz de remplazar la vista y cargar los nuevos módulos, debe contaro con el 100% de concenitmientos de cierre por parte de todos los sub módulos creados dentro del contenedor u que, posean el evento alCerrar; ahora bien, si un módulo no tiene evento alCerrar o el evento alCerrar no retorna una confirmación; el valor se asumirá como un valor verdadero, es decir que por defecto el módulo da su concentimiento para ser cerrado.

Ejemplo 1. 
```js
    class Mimodulo{
        alCerrar(){
            return {error:""}
        }
    }

```
El módulo es cerrado sin problemas

Ejemplo 2. 
```js
    class Mimodulo{
        alCerrar(){
            if ( this.estado == "error")
                return {error:"No puede salir"}
            else
                return {error:""}
        }
    }

```
El módulo es cerrado sin problemas si el estado de la clase (ejemplo hipotético), tuviera un valor diferente a error y no dejaría cerrar el módulo si el estado es "error", mostrando un diálogo con el error.

Ejemplo 3.
```js
    class Mimodulo{
        alCerrar(){
            if ( this.estado == "error")
                return {error:"No puede salir", oculto:true}
            else
                return {error:""}
        }
    }

```
Realiza la misma validación que el ejemplo 2, pero en esta ocación NO muestra la ventana de dialogo y en su lugar muestra el mensaje en la consola del navegador.




*[Jesus E. Laynes G.]*

---
[< Regresar](Indice.md)