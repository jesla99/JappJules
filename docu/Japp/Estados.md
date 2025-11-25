[< Regresar](Indice.md)

---
# Estados de un módulo 
Los estados de un módulo de JappN, permiten indicar actividades o eventos especiales que afectan al módulo, algunos de estos estados son colocados de forma automática por el Framework y en algunos casos pueden ser colocados por una rutina o parte del código de nuestras aplicaciones.

Para la versión 0.11.2 cdl core de JappN, existen 2 categorias de estados, estados OK y estados de Error:

### Estados OK 
Estos estados indican que el módulo esta en un momento normal de un flujo, se utilizan para indicar que todo está bien y que no hay anomalías, dentro de estos estados encontramos:

```js
arrEstadoOk=[
    "Cargando", //Indica que el módulo esta en proceso de carga
    "Cargado",  //Indica que el módulo ya terminó de cargar
    "Cerrando", //Indica que el módulo está validando eventos alCerrar
    "Ocupado"   //Indica que el módulo esta procesando o esperando información
]
```

### Estados de Error: 
Estos estados se utilizan para indicar que algo no está bien o que sucedió algo fuera de lo normal dentro de un flujo optimo de trabajo de una aplicación, los estados son:

```js
arrEstadoError=[
    "Id duplicado", //Indica que un módulo fué contruido y por alguna razón posee un ID ya existente 
    "Id invalido", //Indica que por alguna razón el ID asignado no es válido
    "Bloqueado",    //Indica que el módulo está bloqueado, ya sea por el Framework o por parte del código de una app, es decir que, el programador necesita que el módulo este en ese estado para no poder ser cerrado por ejemplo.
]

```
Nota: 



*[Jesus E. Laynes G.]*

---
[< Regresar](Indice.md)