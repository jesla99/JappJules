[< Regresar](Indice.md)

---

# Cargar
JappN es un framework que permite crear Módulos utilizando el método de renderizado de React y permite hacerlo por medio de módulo de función, módulos de clase y módulos de clase JappN; para mas información ver documentación [Módulos](../Modulo.md). 

Debido a la forma en la que JappN trabaja, cada módulo debe ser cargado, registrado y evaluado por JappN ANTES de ser mostrado en pantalla y para ello empleamos la función **Cargar** que se encuentra en la librería **React** y que se hereda a las instancias de módulos tipo **JappN** y se utiliza de la siguiente manera:

```js
//importación del Módulo a cargar
import MiNuevoModulo from "MiNuevoModulo.js"

//Módulo de función
export default ()=>{
    return <div>
        <h1>Nombre del Módulo actual...</h1>
        <button 
            onClick={()=>React.Cargar(<MiNuevoModulo />)}
        >Cargar nuevo módulo.</button>
    </div>
}

```

El ejemplo anterior descarga (quita) el módulo actual, des registra la lógica interna, en pocas palabras desconecta correctamente el módulo de JappN y en su lugar, Carga, contruye, registrar y conecta el nuevo módulo.

Nota: la funcion **Cargar** carga el módulo en toda la ventana, ya que tiene por defecto definido el contenedor **#root** o elemento **raiz**.


## Cargar Módulos dentro de una Vista
Si lo que necesitamos es cargar un módulo sin tener que cambiar de Vista (o sea NO en pantalla completa), entonces requeriremos modificar levemente la invocación de la función **Cargar**, agregando un parámetro extra que indica el nombre del elemento en el que se cargará el nuevo módulo.

```js
//importación del Módulo a cargar
import MiNuevoModulo from "MiNuevoModulo.js"

//Módulo de función
export default ()=>{
    return <div>
        <h1>Nombre del Módulo actual...</h1>
        <div id="#contenedor">Aqui se mostrará el nuevo módulo</div>
        <button 
            onClick={()=>React.Cargar(<MiNuevoModulo />, "#contenedor")}
        >Cargar nuevo módulo.</button>
    </div>
}

```

En este ejemplo, al presionar el botón el nuevo módulo se cargará, pero en este caso no sustituirá al primer módulo ya que, usará como contenedor al DIV con id **contendor** en vez del nodo root.

## CallBack al Cargar
Los módulos tipo clase pueden tener un evento llamado [**alCargado**](AlCargado.md), evento que se lanza inmediatamente después de que el módulo termina de renderizar el elemento html en el DOM del navegador.

Este evento (alCargado), se ejecuta dentro del módulo nuevo y no tiene comunicación con el módulo que está ejecutando la instrucción **Cargar**, pero existe una manera de recibir una invocación similar durante la invocación de **Cargar** por medio de un CallBack de la siguiente manera:

```js
//importación del Módulo a cargar
import MiNuevoModulo from "MiNuevoModulo.js"

//Módulo de función
export default ()=>{
    return <div>
        <h1>Nombre del Módulo actual...</h1>
        <div id="#contenedor">Aqui se mostrará el nuevo módulo</div>
        <button 
            onClick={()=>React.Cargar(<MiNuevoModulo />, "#contenedor", (el)=>{console.log(el)})}
        >Cargar nuevo módulo.</button>
    </div>
}
```

Como se observa en el ejemplo, en este caso al incovar a la función Cargar, se envía como tercer parámetro una función de flecha que recibirá el callback y se ejecutará (al igual que alCargado), después de colocar el nuevo elemento en el DOM del navegador. 

Este callBack devuelve también referencia al elemento construido.

Nota: Si la funcion **Cargar** recibe como segundo parámetro un callBack, interpretará que no se trata de un contenedor y usará ese segundo parámetro para invocar al callBack.

---
[< Regresar](Indice.md)