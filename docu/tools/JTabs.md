[< Regresar](../Indice.md)

---
# JTabs
Este al igual que otros módulos de herramienta, son muy útiles para organizar elementos en la pantalla del usuario, en el caso de JTabs, permite fabricar un listado horizontal de pestañas que, hacen referencia a contenedores que agrupan elementos de una o parte de una funcionalidad.

### Propiedades
Dentro de las propiedades de este módulo están:

* Id: Cadena de texto que identifica de forma única a un módulo. 

* onOpen: Función que se ejecuta la primera vez que cada pestaña es seleccionada, se emplea para obtener una carga dinámica y que el contenido sea cargado solamente si la ficha es seleccionada. 

La función para onOpen, recibe 2 argumentos: el evento del puntero que se generó con el clic del ratón y el elemento div contenedor correspondiente a la pestaña seleccionada.

nota importante: Esta función es invocada únicamente si el contenedor correspondiente a la pestaña, se encuentra vacío. 

* onFocus: Función que se ejecuta cada vez que la ficha obtiene el enfoque, es decir cada vez que se da clic en una pestaña y el contenedor correspondiente se hace visible.

Esta función recibe solo un argumento y este es el contexto del elemento HTML contenedor correspondiente.

* forceOpen: propiedad boleana que modifica el comportamiento de onOpen, si su valor es verdadero, la llamada a onOpen se realizará siempre, no importando si el contenedor correspondiente a la pestaña seleccionada posea o no información.

* mini: propiedad boleana que, seteada como true, permite ocultar el nombre de las pestañas, dejando visible únicamente los iconos de cada pestaña, el valor por defento de esta propiedad es false. (los iconos de cada pestaña son definidos en el contenedor de cada pestaña) 

nota: Si la propiedad mini esta en true y la pestaña no tiene asignado un icono, JTabs le asignará un icono genérico.

### Contenido
El contenido de cada una de las pestañas puede ser entregado al módulo de dos maneras:

* Como contenido HTML/JSX: 
Escribiendo cada uno de los contenedores de forma explícita, por ejemplo:

```js
    alCargar(){
        return <JTabs id="miTabs" onOpen={(e,el)=>this.abrir(e, el)}>
            <div tab="Mi Tab 1"> Contenido para el Tab 1</div>
            <div tab="Mi Tab 2"> Contenido para el Tab 2</div>
            <div tab="Mi Tab 3"></div>
        </JTabs>
    }
```
Nota: en este ejemplo, cada div es tomado como ficha de contenido y la propiedad tab, es tomada para crear la pestaña. Hay que tomar en cuenta que en el caso del div 3, aunque dentro de él no haya información alguna, la propiedad onOpen puede al momento de seleccionar la pestaña, buscar el contenido dinámicamente.

* Como propiedad con un res: 
Si fuerá el caso y el numero de pestañas tuviera que ser dinámico, el módulo JTabs puede generar las pestañas y contenido a partir de un resultado de consulta al backend o un objeto res, como se describe a continuación: 

```js
    alCargar(props){
        const res=[
            {tab:"File 1", icono:"icon-money", contenido:"Contenido para File 1"},
            {tab:"File 2", icono:"icon-box", contenido:"Contenido para File 2"},
            {tab:"File 3"}
        ]

        return <JTabs res={res} opOpen={(e,el)=>this.abrir(e,el)} />
    }
```
 Nota: En este ejemplo la constante res posee un array de parametros para construir cada una de las pestañas y su contenido y como se ve en el ejemplo del registro 3, aunque no tiene contenido, la propiedad onOpen puede cargar el contenido de forma dinámica, de modo que tanto las pestañas, y el contenido puede ser cargado 100% de forma dinámica.

Nota: Existen mas funcionalidades en este módulo que serán documentadas bajo demanda.
---
[< Regresar](../Indice.md)