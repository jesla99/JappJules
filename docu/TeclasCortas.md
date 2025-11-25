[< Regresar](README.md)
---
# Teclas cortas
Una de las novedades de JappN de la version 1.2.0 en adelante, es poder programar de forma fácil y rápida, el uso de teclas cortas. Es importante aclarar que esta funcionalidad solamente esta disponible para módulos JappN y No esta disponible para módulos de función y clase.

Para poder programar teclas cortas es necesario entender que es la propiedad _keys, esta propiedad es una propiedad que se hereda del framework y que lleva en su interior un array de definiciones de teclas cortas, toma como ejemplo de definición el siguiente trozo de código:

```js

    class Modulo extends JappN{
        //definimos la propiedad _keys
        _keys =[
            {key:"F1", fnd:()=>alert('hola soy la tecla F1')},
            {key:"F2", fnd:()=>alert('hola soy la tecla F2')},
            {key:"Esc", fnd:()=>alert('Presionaste la tecla de Escape')}
        ]

        alCargar(props){
            ...
        }
    }

```
Como podrás observar, cada una de las posiciones del array de _keys, poseen la tecla y la función que se ejecutará al presionar la tecla.

### Definición de una tecla corta:
**Teclas**

Inicialmente la definición requiere una propiedad key, code o keyCode, valores que responden a las respectivas propiedades key, code u keyCode del evento de teclado de javascript respectivamente.

Las tres propiedades anteriores son obligatorias, pero existe otras dos propiedad de la definición de tecla corta que son opcional y estas son ctrl y alt; por omisión ctrl y alt estan configuradas con el valor false y en caso de definirse como true, indicarán que la tecla corta requiere presionar respectivamente las teclas CTRL y/o ALT

*Nota importante*
- *key*: Hace referncia a la tecla y hace diferencia entre mayusculas, minusculas, ctrl izquierdo o derecho, etc.
- *code*: Hace referencia a la tecla y no importa si es mayúscuka o minúscula o si es izquierda o derecha
- *keyCode*: hace referencia al código de la tecla, valor de la tabla ascii

**Función o acción**

Además, la definición de la tecla corta requiere una función para la acción, esta se define en propiedad fnd; es importante aclarar que para comodidad se suguiere utilizar una función de flecha.


Ejemplo práctico de teclas cortas:

```js
    class Inicio extends JappN{
        _keys=[
            {key:"F1", fnd:()=>alert('Presionaste F1')},
            {key:"F2", fnd:(e)=>console.log('Presionaste F2 y este es el evento de teclado: ', e)},
            {key:"A", fnd:()=>console.log("Presionaste A mayúscula")},
            {key:"a", fnd:()=>console.log("Presionaste a minúscula")},
            {code:"KeyB", fnd:()=>console.log("Presionaste la tecla A no importa si es mayúscula o minúscula")},
            {keyCode:27, fnd:()=>console.log("Presionaste la tecla Escape")},
            {keyCode:27, ctrl:true, fnd:()=>console.log("Presionaste la tecla CTRL + Escape")},
            {code:"KeyG", alt:true, fnd:()=>console.log("Presionaste la tecla ALT + G")},
            {code:"KeyA", ctrl:true, alt:true, fnd:()=>console.log("Presionaste la tecla CTRL + ALT + A")},
        ]

        alCargar(){
            return <div>
                <h1>Prueba de teclas cortas</h1>
                Es importante saber que el foco debe estar en la pagina para que las teclas puedan ser reconocidas, asi que por favor da click (AQUI)
                <p>
                    Presiona:
                    <ul>
                        <li>F1</ul>
                        <li>F2</ul>
                        <li>la letra A</ul>
                        <li>la letra a</ul>
                        <li>la letra B</ul>
                        <li>la tecla de escape</ul>
                        <li>presiona control y Escape</ul>
                        <li>Presiona Alt y G</ul>
                        <li>Presiona Control, Alt y A</ul>
                    </ul>
                </p>
            </div>
        }
    }

    export default Inicio

```

La definición de teclas está habilitada al momento de cargar el módulo en donde se definieron, si por alguna razón un módulo es cargado en una ventana emergente o en un dialogo y este módulo tiene teclas cortas activas, las teclas cortas activas que se ejecutaron de primero quedarán temporalmente inactivas hasta que el módulo que se ejecutó por ultimo sea cerrado.

## Nota General:
JappN facilita la programación de teclas cortas con la finalidad de que tus proyectos tengan mucha mas versatilidad y ergonomía; así que aprovecha para hacer que tus proyectos sea mucho mas profesionales.


*[Jesus E. Laynes G.]*

---
[< Regresar](README.md)