[< Regresar](Indice.md)
---

# Colap (Extensión Jsx)
Esta extensión de JSX, permite crear de forma automática la funcinalidad de colapsar contenido, al decir colapsar nos referimos a hacer visible o no visible elementos en pantalla, en este caso, aunque es seteada en un elemento, su funcionalidad trabaja tanto con el elemento en donde se definió como en el elemento siguiente (primer elemento hermano encontrado)

Ejemplo:

```js
    alCargar(props){
        return <div>
            <h3 class="jsx_Colap">Mostrar/Ocultar</h3>
            <div>
                Este es un elemento colapsable y aunque la extensión esta aplicada a el elemento h3, la extensión coloca la acción de click en h3 y en base a esa acción hace visible u oculta el div con este contenido.
            </div>
        </div>
    }

```

Como se aprecia en el ejemplo, el uso de esta extensión es sumamente sencillo y práctico.


*[Jesus E. Laynes G.]*

---
[< Regresar](Indice.md)