const child_process = require('child_process');
const fs = require('fs');
//const path = require('path');

//1. carpeta vistas
if ( !e('src/js/vistas')){
  console.log('No es posible setear la carpeta Vistas')
} else {
  //si si existe vistas
  if ( !e('src/js/local') ){
    console.log('No es posible setear la carpeta Local')
  } else{
    // si ambas carpetas existen
    //setar bin folder
    if ( !e('src/js/vistas/bin')){
      //si no existe bin
      console.log('No es posible setear carpeta vistas/bin')
    }else{
      //si existe bin
      copiar('init/local/Producto.tsx', 'src/js/local/Producto.tsx')

      copiar('init/vistas/Inicio.tsx', 'src/js/vistas/Inicio.tsx')
      copiar('init/vistas/bin/dsn.tsx', 'src/js/vistas/bin/dsn.tsx')
      copiar('init/vistas/bin/env.tsx', 'src/js/vistas/bin/env.tsx')
      copiar('init/vistas/bin/app.css', 'src/js/vistas/bin/app.css')
      copiar('init/vistas/bin/jappn.png', 'src/js/vistas/bin/jappn.png')
      runModules()
    }
  }  
}

//2. variables locales
localStorage['jappnLastUpdate']=new Date().getTime()

function runModules(){
  console.log("Instalando módulos de Node...")
  child_process.exec("npm install", (error, stdout, stderr) => {
    if (stderr == "" ){
      console.log (stdout)
      console.log("\n\nJAPP-N Instlado satisfactoriamente, para lanzar la auto transpilación incremental ejecute: [node watch], [node w2], [node w2 web] ó [node w2 web mserver] ")
    }else {
      console.log( '[ERROR] ', stderr)
    }
  })
}



function copiar(a,b){
  try {
    fs.copyFileSync(a, b);
    console.log(`Archivo "${a}" copiado a "${b}" exitosamente.`);
  } catch (error) {
    console.error(`Error al copiar el archivo "${a}":`, error);
  }
}


function e(nombre){
  if (!fs.existsSync(nombre)){
    try {
      fs.mkdirSync( nombre )
      return true
    } catch (error) {
      return false     
    }
  }else{
    return true
  }
}
