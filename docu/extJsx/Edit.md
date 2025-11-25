[< Regresar](Indice.md)
---

# Edit (Extensión Jsx)
Extensión de jsx que permite colocar la opción de editable a un elemento NO editable, elemento como: div, span, li, td o cualquier elemento que tenga innerHTML.

Ejemplo:

```js
    alCargar(props){
        return <div>
            <h3>Mis Datos</h3>
            Estos son los datos de <span class="jsx_Edit">Su nombre aquí</span>:<br />
            Edad: <span class="jsx_Edit">Mi Edad</span>
        </div>
    }

```

En el ejemplo anterior, el nombre del usuario y la edad del mismo, son elementos html que normalmente no son editables, pero que debido a la extensión "jsx_Edit", pueden ser editables al momento  de dar doble clic sobre esos elementos. Ahora bien, es importante mencionar que aunque el contenido es editable, al modificar el contenido, este contenido solamente se modificara de forma temporal, por lo que es necesario programar un poco mas y conectar este cambio a una base de datos.

Para conectar el cambio a la parte lógica, es necesario implementar una función de retorno "callBack" de la siguiente manera:



```js
    alCargar(props){
        return <div>
            <h3>Mis Datos</h3>
            Estos son los datos de <span class="jsx_Edit" callBack={o=>console.log(o)}>Su nombre aquí</span>:<br />
            Edad: <span class="jsx_Edit" callBack={o=>this.procesar(o)}>Mi Edad</span>
        </div>
    }

```

En este segundo ejemplo, al modificar el nombre del usuario, se ejecutará una función de retorno que mostrará en la consola el objeto ya modificado.

En el caso de Mi Edad, al modificar el contenido del elemento, se ejecutará una función interna llamada procesar; es importante mencionar que el callBack retorna el elemento HTML completo, la razón de hacerlo es debido a que, es posible que después de modificar el contenido del elemento, sea necesario analizar la información. Un ejemplo de ello sería validar los datos ingresados.


*[Jesus E. Laynes G.]*

---
[< Regresar](Indice.md)