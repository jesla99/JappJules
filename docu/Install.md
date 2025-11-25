[< Regresar](README.md)

---
# Instalar JappN
Para poder instalar JappN con la intención de desarrollar proyectos, primero debemos contar con alguno requisitos:

```
    * NodeJs
    * Git
    * IDE de desarrollo (vsCode recomendado)
    * Servidor Web local o en la nube (vsCode funcional)
```

saltar a [Pasos de instalación](#pasos-de-instalación)

## Instalando Requisitos:
Si ya posee los requisitos instalados, puedes saltar a la siguiente sección

### NodeJS
Descargar e instala nodejs del sitio oficial [https://nodejs.org/es](https://nodejs.org/es)

### GIT
Descarga e instala git del sitio oficial [https://git-scm.com/](https://git-scm.com/)

### IDE de desarrollo
Puedes emplear el IDE de desarrollo que desees, pero te sugerimos usar visual Code, ya que este IDE posee extensiones que ayudan a desarrollar de mejor manera

### Servidor Web
Una vez tu proyecto este listo para ser desplegado, es necesario colocar el proyecto en un servidor web, ya sea de forma local o en la nube, para ello puedes usar el servidor que desees, dentro de las alternativas estan:

* Live Server (extnsión de vsCode)
* Xampp (apache instalable para windows)
* apache (linux)
* ngnx (linux)
* ISS (windows)
* Cualquier otro.


## Pasos de instalación
1. clone el framework: 
```
    git clone http://ccenter.alchaz.com:8080/jesus/jappn.git miProyecto
```

2. Instala los agregados del framework
```
    node install
```

3. Ejecutar JappN
Opciones de inicio:

a. Iniciar depurador Watch antiguo. (deprecated)
```
    node watch
```

b. Nuevo transpilador w2
```
    node w2
```
Este nuevo transpilador toma en cuenta todos los archivos que formen parte del proyecto y no solamente los archivos TSX.

c. Transpilador w2 con webServer
```
    node w2 web
```
Ejecutará el transpilador y levantará un servidor web que se permitirá consultar jappN desde el navegador.

d. Transpilador w2 con webServer y ApiServer. (mserver)
```
    node w2 web mserver
```
Además de ejecutar el servidor web, levanta un servidor para backend con node js que se encuentra en la carpeta /mserver




4. Cargar proyecto
En este ejemplo asumimos que estas usando visual Code.

4.1. Carga la carpeta del proyecto y busca en la estructura la carpeta /dist, dentro de ella existe un archivo llamado index.html.

4.2. Con la extensión live server de visual code ya instalada, puedes dar click derecho sobre index.html y selecciona **abrir en Live Server**

4.3. Live server abrirá automaticamente el navegador por defecto y cargará el proyecto de forma local.


nota: el tercer y cuarto paso será necesario cada vez que querramos que jappn active la transpilación progresiva.

*[Jesus E. Laynes G.]*

---

[< Regresar](README.md)