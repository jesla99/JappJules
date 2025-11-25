[Regresar a Menu principal](../README.md)

---
# Extensiones JSX
Las extensiones JSX son funcionalidades que pueden ser aplicadas de forma automática a los elementos HTML, aprovechando el momento en el que se renderizan por medio de la libreria React.

Lo interesante de estas extensiones en comparación de las herramientas de JAppN o de las funciones propias de JappN, es que, las extensiones se cargan de forma dinámica, es decir que, no están cargadas o importadas en JappN de forma estatica o fija, estas se cargan bajo demanda, ocupando de esa manera espacio en memoria únicamente cuando la extensión sea requerida.

Otra de las ventajas que tiene una extensión de JSX en comparación a una herramienta de JappN, es que para aplicarla no hay que hacer mas que agregar una clase de css al elemento, para que al momento de renderizarse utilice dicha clase para cargar y aplicar la nueva funcionalidad.

### prefijo para extensiones JSX
Como ya se explicó, las extensiones JSX se aplican por medio de una clase de css, el formato para aplicar dicha extensión es el siguiente:

* Prefijo_Extensión

ejemplos:

1. jsx_Colap
2. jsx_VAcordion
3. jsx_Edit
4. jsx_Gancho
5. jsx_JSlider
6. jsx_Media

* ejemplo aplicado:
```js
    alCargar(props){
        return <div>
            <h1 class="jsx_Colap">Alumnos</h1>
            <ul>
                <li>Alumno 1</li>
                <li>Alumno 2</li>
                <li>Alumno 3</li>
                <li>Alumno 4</li>
                <li>Alumno 5</li>
            </ul>
        </div>
    }
```

Nota: Es importante enfatizar que el nombre de la extensión **siempre** iniciará con letra mayúscula.

## Extensiones instaladas en esta versión de JappN

* [jxs_Colap](Colap.md)
* [jxs_VAcordion](VAcordion.md)
* [jxs_Edit](Edit.md)
* [jsx_Gancho](Gancho.md)
* [jsx_JSlider](JSlider.md)


*[Jesus E. Laynes G.]*

---
[Regresar a Menu principal](../README.md)
