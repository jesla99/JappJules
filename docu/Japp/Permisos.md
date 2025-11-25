[< Regresar](Indice.md)

---
# Control de permisos
Japp-N ha sido contruido con la intención de crear aplicaciones web, por lo que el control de permisos es un tema muy importante y necesario, es por eso que desde la versión 0.4.2 de Japp-N, es posible utilizar control de permisos. 

Como la mayoría de funciones de Japp-N, se busca que la aplicación de permisos sea de forma sencilla y tomando en cuenta este principio, para aplicar permisos debemos tener en cuenta 2 aspectos: 

1. Usuario y/o Rol 
2. Definición de permisos

### Usuario y Rol
Para identificar qué usuario hace uso de la aplicación y saber que rol posee, se implementa la propiedad interna de React Us y UsRol, estas propiedades de tipo numerico, poseen respectivamente el ID de Usuario y el ID de Rol del usuario; con estas dos propiedades, se puede identificar al usuario que hace uso de Japp-N.

Nota: Estos valores deben ser seteados al momento de autenticar al usiario, hay que tomar en cuenta que algunos módulos de autenticación podrían hacer este seteo automáticamente, pero en ocasiones es necesario hacerlo de forma manual.

### Objeto de Permisos
Para poder definir los permisos, es necesario crear un objeto de definición de permisos que, posea la información necesaria para que JappN sepa qué debe permitir y qué debe denegar y la forma en la que debe notificarlo.

La estructura del objeto de permisos es la siguiente:

```json
    {
        "Us":[1,8],
        "UsRol": [2, 6],
        "tipo": 1,
        "mensaje": "información para notiricación personalizada"
    }
```

La llave **Us** es un array que, contiene cada uno de los ids de los usuarios que tienen permiso de acceso.

La llave **UsRol** es un array que, contiene cada uno de los ids de rol de los usuarios que pueden tener acces.

La llave **tipo** es un valor numérico que, indica el tipo de notificación al usuario.

#### Tipos de notificación
Cuando JappN identifica que un usuario NO posee permiso para acceder a un recurso, tiene la posibilidad de indicarlo de diferentes formas que, se identifican con un número:

0. Notificación con letras grandes y un boton para regresar al módulo de inicio. este tipo de notificación es la notificación por defecto para cuando el permiso se aplica a una vista completa.

1. Notificación mediana, no posee botón para regresar al módulo de inicio.

2. Notificación pequeña, diseñada para ser discreta.

3. Sin notificación, renderiza únicamente un span vacío, ideal para cuando un elemento no debe ser mostrado, por defecto para permisos que aplican a un elemento en particular.

4. Notificación personalizada, permite agregar un mensaje y éste puede ser un texto, una cadeja jsx o un módulo; inclusive puede recibir this.Dialogo({mensaje:<MiMensaje />}), para poder presentar una alerta visualmente personalizada dentro de una ventana modal.

### Permisos de Acceso al Módulo
Los permisos de acceso permiten especificarle a Japp-N, qué usuario y qué rol pueden tener acceso a un módulo específico, para ello, es necesario colocar como propiedad interna del módulo el siguiente objeto:

```js
    class Mimodulo{
        _permiso={
            usuario:[1,8],
            rol:[2,3]
        }

        alCargar(props){
            return <h1>Hola mundo!!</h1>
        }
    }

```
En el ejemplo anterior, el modulo con nombre Mimodulo, en su propiedad _permiso, describe que a ese módulo solamente tendrá acceso los usuarios 1 y 8 o los usuarios que tengan el rol 2 ó 3. 

Si el usuario que intenta acceder al módulo no cumple con esos requisitos, Japp-N no lo dejará cargar el contenido del módulo y le mostrará un mensaje indicando que no tiene acceso, el mensaje por defecto esta pensado para mostrarse en toda la pantalla; Si necesitamos cambiar el tipo de mensaje, podemos indicar el tipo de mensaje agregando a _permiso la opcion tipo que por defecto es 0 y que para la versión 0.10.2 existen el tipo 0 al 4.

```js
    class Mimodulo{
        _permiso={
            usuario:[1,8],
            rol:[2,3],
            tipo:1
        }

        alCargar(props){
            return <h1>Hola mundo!!</h1>
        }
    }
```

### Permisos de Acceso a Elementos
Como hemos visto, los permisos de acceso al módulo permiten desplegar o no la información completa que él construye, pero en algún momento y en algunos casos, será necesario poder permitir o no, el acceso a elementos de un módulo, por lo que, para dar solución a ésta necesidad, JappN permite definir permisos de acceso anclados a elementos específicos. De ésta manera se podrá condicionar el acceso a elementos específicos para usuarios específicos.

Ejemplo:

```js
    alCargar(){
        const admin = {
            rol:[1],
            usuario:[1],
            tipo:4,
            mensaje:<Dialogo mensaje={<MiAdertencia />} win="medio"/>
        }

        const user ={
            rol:[2]
        }
       
        return <div id="mono" xjcss="css/jcss.css">
            
            Texto General para todos los usuarios de Módulo.
            <h2 class="titulo" _permiso={user}>Titulo que solo debe ver el *usuario*</h2>
            <p _permiso={admin}>Instrucciones que solo debe ver un *administrador*</p>
        </div>
    }

```

En este ejemplo, el tag posee dentro de él la propiedad _permiso que posee un objeto de permisos que, indican a JappN que usuario puede ver el elemento.

## Envío de ID para acceso
Como ya fue expuesto, el módulo o los elementos de un módulo, pueden tener configurado un control de permisos, por lo que, es necesario que al invocar (usar) el módulo, exista una propiedad que, indique el valor del ID de usuario y/o ID del rol del usuario, de esa manera JappN podrá saber si los permisos se cumplen o no.

Para poder enviar los IDS de permisos, utilizaremos la propiedad jsx llamada _Us en el caso de ID de usuario y _UsRol para el caso de ID de rol de la siguiente manera.


```js
    alCargar(){       
        return <div>
            <h1>Ventana condicionada por permisos</h1>
            
            <!-- Mi modulo condicionado con permisos al que le mando los IDS -->
            <Mimodulo _Us={1} _UsRol={4}>

        </div>
    }

```

Nota: Según el caso de uso, se considera que es poco probable que los datos de las propiedades _Us y _UsRol sean valores fijos, por lo que se entiende que en la mayoría de veces, este valor debe ser un valor proveniente desde el backend.

Nota: Según el caso de uso, se entiende que el módulo puede recibir _Us y/o _UsRol 

Nota IMPORTANTE: Es imporante tomar en cuenta que, el sistema de permisos SOLAMENTE funcionará cuando los permisos son definidos en un módulo JappN, no obstante la invocación del módulo, puede ser desde cualqueir lugar, no importanto el tipo de módulo desde donde se invoca.

---
[< Regresar](Indice.md)
