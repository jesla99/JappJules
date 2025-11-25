[< Regresar](Indice.md)

---
# Eventos Públicos
Los eventos públicos son una técnica de programación en javascript que permite crear una entrada al módulo desde fuera de JappN, esta práctica puede representar un riezgo de seguridad para nuestros proyectos, pero en casos muy específicos y no muy delicados, quizá puede ser requerido.

Para crear este evento, se requiere contar con el resultado del módulo ya renderizado en el DOM, por lo que requerimos trabajar del lado del evento alCargado; Dentro de este evento, tomaremos el elemento renderizado y le agregaremos un evento público, en este ejemplo el evento publico será llamado **ver**  y se define de la siguiente manera:

```js
    ...
    alCargado(el, props){
        el['ver']=(props)=>this.ver(props)
    }

    ver(props){
        //aqui debe estar escrito el código que se ejecutará con la función pública
    }
    ...
```

NOTA IMPORTANTE: Emplear un eventi público de esta manera es un riezgo de seguridad muy elevado, ya que existe la posibilidad de que, por error retornemos el contexto de un módulo y con ello hablamos una puerta para acceder a todo nuestro proyecto.





---

*[Jesus E. Laynes G.]*

---
[< Regresar](Indice.md)