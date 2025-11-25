const readline = require('readline');
const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');
const chokidar = require('chokidar');
const { exec } = require('child_process');
let errores=0
let pila=[]
let isRun=false
let loading=["-", "/", "|", "-", "\\"]
let loadToken=0

var J=0

/////////// Cache de transpilacion ////
//verificamos si es primera transpilacion
const primera = !fs.existsSync(path.join(__dirname,'dist'))

//abrimos archivo:
const rutaArchivo = path.join(__dirname, '._watchIndex.json')
//registros de cache
let registros = {}
 // Si el archivo existe, lee su contenido
 if (fs.existsSync(rutaArchivo)) {
  const contenido = fs.readFileSync(rutaArchivo, 'utf8');
  registros = JSON.parse(contenido);
}
console.clear()
////cache de transpilacion


const lstIgnorar=[
  ".DS_Store"
]

// Observar los archivos TypeScript
//const watcher = chokidar.watch('./src/**/*.*', { ignored: /^\./, persistent: true });
const watcher = chokidar.watch('./src/**', { ignored: /^\./, persistent: true });

// Evento que se dispara cuando se añade un archivo
watcher.on('add', miPath => {
  //console.log(`Archivo ${miPath} ha sido añadido`)
  pila.push(miPath)
  if (!isRun) {
    isRun=true
    analizar()
  }
});


// Evento que se dispara cuando se detecta un cambio
watcher.on('change', (miPath) => {
  //console.log(`Archivo ${miPath} ha sido modificado`);
  pila.push(miPath)
  if (!isRun) analizar()
});


// Evento que se dispara cuando se elimina un archivo
watcher.on('unlink', miPath =>{
  console.log(`Archivo ${miPath} ha sido eliminado`)
  const path = miPath.split("/")
  let arch = path[path.length-1].split(".")

  path[0]="dist"
  if (arch[1] == ".ts" || arch[1] == "tsx"){
    arch[1]="js"
  }
  path[path.length-1]=arch.join(".")

  fs.unlink(path.join('/'), (err) => {
    if (err) {
        console.error('Error al eliminar el archivo:', err);
    } else {
        console.log('Archivo productivo eliminado correctamente.');
    }
  });
})

// Para mantener el proceso de Node.js vivo
watcher.on('ready', () => {
  // Mantener el proceso vivo
  process.stdin.resume();
});


async function analizar(){
 
  if (pila.length > 0) {
    const item = pila.shift()
    render(item)
  }else{
    isRun=false
    if (errores == 0) console.clear()
    console.log("\n   Errores: ", errores)
    console.log("*  Esperando mas cambios....")
    if (primera ) console.log("Primera transpilacion existosa.")
    errores=0
    // Escribe los registros actualizados en el archivo
    fs.writeFileSync(rutaArchivo, JSON.stringify(registros, null, 2));
    J++
    if (J==2 && primera ){
      exec(`npx tsc`, (error, stdout, stderr) => {})
    }
  }
}

function ignorar(miPath){
  for(let i=0;i<lstIgnorar.length;i++){
    if (miPath.indexOf(lstIgnorar[i]) > -1 ) return true
  }
  return false
}


async function render(miPath){
  const ignore = ignorar(miPath)
  if ( ignore == true ) {
    analizar()
    return
  }

  const ext =  miPath.substring(miPath.lastIndexOf(".")+1).toLowerCase()
  switch(ext){
    case "ts":
    case "tsx":
      ts(miPath, err=>{
        if(err) errores++
        analizar()
      })
    break
    default:
      const stat = await fsp.stat(miPath)
      const val = valCompilar(miPath, stat.mtime.toISOString())
      
      if (val){
        cp(miPath, err=>{
          if(err) errores++
          analizar()
        })
      }else {
        analizar()
      }
  }
}

async function ts(miPath, cb){
  const path = miPath.split("/")

  ///Control de cache
  const stat = await fsp.stat(miPath)
  const val = valCompilar(miPath, stat.mtime.toISOString())

  if (val){
    readline.cursorTo(process.stdout, 0, 0); // Las coordenadas son 0-based
    console.log("                                                                     ")
    readline.cursorTo(process.stdout, 0, 0); // Las coordenadas son 0-based
    process.stdout.write(loading[loadToken] + " Analizando... " + miPath);
    loadToken++
    if (loadToken>4)loadToken=0

    if (!primera){
      exec(`npx tsc --jsx react --rootDir ./src --outDir ./dist --module ES2022 --target ES2022 ${miPath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error al ejecutar npx tsc: ${miPath}`);
            console.error( stdout, stderr)
            cb(true)
        }else{
          cb(false)
        }
      })
    }else{
      cb()  
    }
  }else{ //si no hay que compilar
    cb()
  }
}

function cp(miPath, cb){
  //console.log("Copiando... ", miPath)
  //ignorar
  const ignore=[".git", ".DS_Store"]

  for(let i=0; i<ignore.length; i++){
    if ( miPath.indexOf(ignore[i]) > -1 ){
      cb(false)
      return
    }
  }

  const destino = "dist"+miPath.substring(3)
  // Llamar a la función para copiar el archivo
  copiarArchivo(miPath, destino, function(err) {
    if (err) {
      // Manejar errores aquí
      console.log('Error al copiar el archivo:', err);
      cb(true)
    } else {
      //console.log('Copiado: ', destino);
      cb(false)
    }
  });

}

// Función para copiar un archivo
function copiarArchivo(source, target, cb) {
  // Verificar si el directorio de destino existe, si no, crearlo
  const targetDir = path.dirname(target);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Crear un stream de lectura
  var rd = fs.createReadStream(source);
  rd.on('error', function(err) {
    console.log('Error al leer el archivo:', err);
    cb(err);
  });

  // Crear un stream de escritura
  var wr = fs.createWriteStream(target);
  wr.on('error', function(err) {
    console.log('Error al escribir el archivo:', err);
    cb(err);
  });
  wr.on('close', function(ex) {
    cb();
  });

  // Iniciar la copia
  rd.pipe(wr);
}

function valCompilar(nombreArchivo, fecha){
  // Verifica si el archivo ya está registrado
  if (registros[nombreArchivo]) {
    // Si la fecha es diferente, actualiza el registro
    
    if (registros[nombreArchivo] != fecha) {
      registros[nombreArchivo] = fecha;
      return true
    } else {
      return false
    }
  } else {
    // Si el archivo no está registrado, crea un nuevo registro
    registros[nombreArchivo] = fecha;
    return true
  }
}