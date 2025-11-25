[< Regresar](Indice.md)

---
# Encapsulamiento
Para entender la necesidad de Varaibles Globales, primero es necesario comprender que es el encapsulamiento.

Como medida de seguridad, JappN No expone en la consola variables, clases o instancias de clases; además, debido a la técnica utilizada, los módulos permiten acceso parcial a la información interna pero con ciertas limintantes.

Debido a este encapsulamiento, en ocasiones se hace muy difícil o imposible, compartir variables entre módulos que no están conectados por medio del árbol de nodos o por propiedades.

En este caso, es necesario contar con un metodo para compartir valores en cualquier parte de nuestra aplicación y es ahí en donde las variables globales son necesarias.

# Variables globales
En JappN, las variables globales NO son precisamente variables publicadas de forma glonal, son mas variables de un módulo que pueden ser compartidas entre otros módulos.

En este caso para hacer uso de variables globales JappN estadariza el uso del objeto **vars** del archivo de entorno env.tsx que se encuentra en la carpeta bin de las vistas.

Uso:

```js
//modulo tipo funcion completamente independiente
import {vars} from "./bin/env.js"

export default ()=>{
    vars['compartir'] = "Valor a compartir"

    return <h1>Titulo aislado</h1>
}

```

```js
//Segundo módulo cargado incluso cuando el módulo anterior ya fué desmontado del árbol de nodos
import {vars} from "./bin/env.js"

export default ()=>{
    return <h1>Titulo aislado con valor {vars.compartir}</h1>
}

```

De esta manera, podemos emplear le objeto **vars** para almacenar información temporal siempre y cuando la aplicación NO haya sido recargada.



*[Jesus E. Laynes G.]*

---
[< Regresar](Indice.md)