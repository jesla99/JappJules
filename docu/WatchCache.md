[< Regresar](README.md)

---

# Archivo de cache para Transpilacion Progresiva

La transpilación es un poroceso muy importante a la hora de estar trabajando con nuestro proyecto, esto debido a que si bien ya se ha mencionado, Japp-N se trabaja con archivos TSX que requieren ser transcritos o transpilados, por lo que cada vez que un archivo se crea, se modifica o elimina; es necesario hacer ejecutar un proceso de actualización de la carpeta /dist, ya que es ahí en donde se encuentra el proyecto listo para ser desplegado y definitivamente deseamos tener la versión mas actual. 

Para esta tarea, Japp-N cuenta con el comando node w2, que realiza una transpilación inicial de todos los archivos tanto de Japp-N como los archivos de nuestro proyecto, este proceso es un proceso que en una maquina pequeña puede llevar un tiempo considerable y en versiones anteriores a la versión 0.5.1, cada vez que se ejecuta el comando en mención, se realiza al inicio la transpilación de todos los archivos, tal como está definido en el parrafo anterior. 

A partor de la version 0.5.1 y posteriores, Japp-N incluye el archivo ._watchIndex.json, que se genera automáticamente tras la primera ejecución de node w2; este archivo se coontruye con un indice de todos los archivos que Japp-N analiza para ser copiados o transpilados a la carpeta de dist, al mismo tiempo guarda la ultima fecha de modificación, esto con la finalidad de tener un índice que ayudará a node w2 en siguientes ejecuciones, de manera que node w2 solamente compilará el 100% de los archivos (Japp-N y nuestro proyecto) y en posteriores ocasiones solamente compilará o copiará aquellos archivos que sufrieron modificación mientras el proceso de node w2 estaba apagado. 

Si por alguna razón node w2 presentara un comportamiento anómalo y aun estando en ejecición algunos archivos no estuvieran siendo actualizados, por salud de la carpeta /dist, un proceso manual recomendado es el siguiente:

```
    1. Detener node w2 presionando ctrl + c
    2. Eliminar la carpeta dist
    3. Eliminar el archivo ._watchIndex.json
    4. Ejecutar de nuevo el proceso de node w2
```

Nota: El archivo ._watchIndex.json y la carpeta /dist, se generan de forma automática al ejecutar por primera vez el proceso de node w2; estos datos no están incluidos en el repositorio.

---
[< Regresar](README.md)