[< Regresar](Indice.md)
---

# Gancho
Extensión que permite crear un gancho de comunicación entre el DOM y el contexto externo hacia JappN, implementar este gancho conlleva algunos riezgos de seguridad, ya que toda la lógica de JappN se encuentra protegida bajo un encapsulamiento, de tal manera que desde la consola o scripts externos no puedan acceder a JappN.

Al crear un gancho, JappN estará expuesto permitiendo que un script externo o desde la consola del navegador, cualquier persona pueda ejecutar una llamada al gancho expuesto (tirar del gancho).

## Contexto del gancho
El contexto del gancho (llamada), dependerá del elemento al que sea asignado, por ejemplo:

### Modulo Clase o JappN
Un gancho creado sobre un módulo de clase o modulo jappn, permite generar una llamada al evento [alTirar](../Japp/alTirar.md), permitiendo el envío de propiedades, pero por segurida evitando que el evento alTirar (evento interno de jappn) devuelva algun resultado a la invocación externa.

### Elemento HTML
Si el gancho es contruido sobre un elemento HTML, debido a que este no es un módulo con lógica y a que no puede poseer un evento alTirar, la invocación del gancho requerira parametros React para hacer uso de la libreria React y cargará el resultado dentro del elemento que posee contruido el gancho.

### Modulo de funcion 
Un módulo de función no permite tener acceso a ganchos, no obstante cualquier elemento HTML o Modulo de clase y modulo JappN que se encuentre dentro de la clase de función, si podrá tener definido y aplicado ganchos.


## Ejemplo de gancho para Modulo de Clase y Modulo JappN
```js
    export default class MiModulo{
        alCargar(){
            return <h1 id="miElemento" class="jsx_Gancho" >Hola mundo</h1>
        }

        //evento que se ejecutará al llamar al gancho
        alTirar(props){
            alert('mensaje ejecutado al invocar el gancho')
        }
    }

```

Como se puede observar, el elemento que tiene contruido del gancho debe poseer un ID, mismo que ser utilziará para tirar del gancho de la siguiente manera:

```js
    ...
    //En cualquier parte del código
    const el = document.querySelector("#miElemento")
    
    //tirar del gancho sin capturar respuesta
    el.tirar() 
    
    //Si el gancho devuelve un valor, tirar del cancho y capturar respuesta
    const valorDevuelto = el.tirar()
    ...

```

*[Jesus E. Laynes G.]*

---
[< Regresar](Indice.md)