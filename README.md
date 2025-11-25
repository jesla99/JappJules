# JappN
Mini Framework escrito en NodeJs, propiedad de Jobsa.gt 
Programado por: Jesus Laynes

## Instalación
1. Clonar el repositorio
```
    git clone http://ccenter.alchaz.com:8080/jesus/jappn.git miProyecto
```

2. Ejecutar la instalación dentro de la carpeta clonada
```
    cd miProyecto
    node install
```

## Transpilación (compilar archivos a .js)
1. Lanzar el modo de observación y compulación (traspilación) incremental.
```
    node watch
```

2. montar la carpeta dist en un servidor web o ejecutar la extensión de vsCode "liveServer" sobre el archivo index.html de la carpera /dist

# Requisitos
1. Tener instalador vsCode (de preferencia, ya que dispone de una extnsión como servicio de paginas web).

2. Tener instalado y configurado GIT

3. Tener instalado Nodejs, de la versión 20 en adelante

# Estructura del framework
La estructura de carpetas es la siguiente:

### En la carpeta raíz /:
* docu          // Carpeta de documentación
* src           // Carpeta con el código fuente en Typescript + JSX
* dist          // Carpeta con el proyecto transpilado a Javascript puro
* .gitignore    // Configuración para ignorar archivos in necesarios
* install.js    // Script de instalación del Framework
* watch.js      // Script de transpilacción incremental del Framework
* README.md     // Archivo de ayuda.

### En la carpeta /src:
* css           // Carpeta que posee estilos y recursos graficos para el JappN
* js            // Carpeta con el código fuente en tsx para JappN y proyectos
* local         // Carpeta con los servicios Rest locales
* install       // Carpeta con los archivos de instalación 
* index.html    // Punto de acceso o entrada al proyecto

### En la carpeta /src/js:
* Interfaces    // Carpeta con interfases del JappN
* libs          // Carpeta con las librerias de JappN
* tools         // Componentes o herramientas para proyectos
* local         // Archivos del servicio Rest local
* vistas        // Archivos fuente del proyeto
* app.tsx       // Lanzador de vistas del proyecto
* Config.tsx    // Archivo de configuración global para JappN

### En la carpeta /src/js/vistas:
* bin           // Carpeta con datos del proyecto 
* Inicio.tsx    // Archivo con el módulo de inicio del proyecto
* {Otros}.tsx   // Otros archivos o módulos del proyecto

### En la carpeta /src/js/vistas/bin:
* app.css       // Hoja de estilo para el proyecto
* dsn.tsx       // Definición de origen de la base de datos local
* env.tsx       // Variables de entorno del proyecto