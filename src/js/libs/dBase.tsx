/** controlador de base de datos local, propiedad de Jobsa.
 * 
 * Programado por Jesus Laynes Enero 2023
 * 
 * 
 * Metodos:
 * abrir //Crea una base de datos
 * getStore //obtiene un almacen
 * create //Crear registro
 * read //Leer un registro
 * readAll //Leer todo un almacen
 * update //Actualiza un registro
 * remove //Reueve un registro
 * find //Busca un registro dentro de un almacen
 * kill //Borrar base de datos
 * obCompare //Compara un registro (un objeto) con otro
 * 
 * 
 */

interface storeParam{
    //Nombre del almacen
    name:string
    //nombre del campo para indexar registro
    keyPath:string
  }
  
  interface dbParam{
    //nombre de la base de datos
    dbName:string 
    //numero de la version de la base de datos
    dbVersion:string
    //almacenes de la versión
    stores:storeParam[]
  }
  
  //Nota: Los stores toman en cuenta UNICAMENTE cuando la base de datos es creada, una vez creada los stores son ignorados
  //      y serán tomados en cuenta solamente en cambio de versión o en la eliminación de la base de datos actual 
  
  const Dbase = (function () {
      let db;
      let autonum=false
    
      // Abrir la base de datos
      const abrir = (param) => {
        return new Promise((resolve, reject) => {
          const request = window.indexedDB.open(param.dbName, param.dbVersion);
    
          request.onerror = () => {
            reject(Error('Error al abrir la base de datos'));
          };
    
          request.onsuccess = () => {
            db = request.result;
            db['autonum']=autonum
            resolve(db);

          };
    
          request.onupgradeneeded =  (event:any) => {
            const db = event.target.result;
    
            console.log("Crenado esquema de la base de datos")
            autonum=true
            if (param['stores'] != undefined){
              param.stores.forEach(async(store) => {
                if (!db.objectStoreNames.contains(store.name)) {
                  await db.createObjectStore(store.name, { keyPath: store.keyPath })
                }
              });
            }
          };
        });
      };
    
      // Obtener el almacén
      const getStore = (storeName, mode) => {
        const transaction = db.transaction(storeName, mode);
        return transaction.objectStore(storeName);
      };
    
      const nextno = (storeName) =>{
        return new Promise((resolve)=>{
          read('_schema_', storeName)
          .then(async (data:any)=>{
            const indice=Number(data['auto'])
            const next = indice+1
            //update('_schema_', storeName, {tabla:storeName, auto:next})
            await update('_schema_', undefined, {tabla:storeName, auto:next})
            resolve(indice)
          })
        })
      }

      // Operaciones CRUD
    
      const create = (storeName, data) => {
        return new Promise((resolve, reject) => {
          const store = getStore(storeName, 'readwrite');

          const request = store.add(data);
          request.onerror = (e) => {  
            reject(Error(e.target.error));
            //reject(e.target.error);
          };
    
          request.onsuccess = (e) => {
            resolve(e.target.result);
          };
        });
      };
    
      const readFirst = (storeName) => {
        return new Promise((resolve, reject) => {
          const store = getStore(storeName, 'readonly');
          const request = store.openCursor(); // Abre un cursor
      
          request.onerror = () => {
            reject(Error('Error al abrir el cursor'));
          };
      
          request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
              // Si el cursor apunta a un registro, devuelve el valor
              resolve(cursor.value);
              cursor.continue(); // Avanza al siguiente registro (opcional, si solo quieres el primero)
            } else {
              // Si el cursor es nulo, significa que no hay registros
              resolve(null);
            }
          };
        });
      };

      const read = (storeName, key) => {
        return new Promise((resolve, reject) => {
          const store = getStore(storeName, 'readonly');
          const request = store.get(key);
    
          request.onerror = () => {
            reject(Error('Error al leer el objeto del almacén'));
          };
    
          request.onsuccess = () => {
            resolve(request.result);
          };
        });
      };
  
      //criterio = {campo: "valor"}
      const readAll = (storeName, criterio:object={}) => {
        return new Promise((resolve, reject) => {
          const store = getStore(storeName, 'readonly');
          const request = store.getAll();
      
          request.onerror = () => {
            reject(Error('Error al leer los objetos del almacén'));
          };
      
          request.onsuccess = () => {
            const campo = Object.keys(criterio)
            if (campo.length == 0){
              resolve(request.result);
            }else{
              criterio[campo[0]]=criterio[campo[0]].toUpperCase()
              const filtrado:any[]=[]
              for (let i=0; i<request.result.length; i++){
                const item = request.result[i]
                if (item[campo[0]].toUpperCase().indexOf(criterio[campo[0]]) > -1) filtrado.push(item)
                if (filtrado.length > 25) i=request.result.length
              }
              resolve(filtrado)
            }
          };
        });
      };
    
      const update = (storeName, key, data:any) => {
        return new Promise((resolve, reject) => {
          const store = getStore(storeName, 'readwrite');
          const request = key==undefined?store.put(data):store.put(data, key)
    
          request.onerror = () => {
            reject(Error('Error al actualizar el objeto en el almacén'));
          };
    
          request.onsuccess = () => {
            resolve(true);
          };
        });
      };
    
      const remove = (storeName, key) => {
        return new Promise((resolve, reject) => {
    
    //console.log("< Del: "+ key)
          const store = getStore(storeName, 'readwrite');
          const request = store.delete(key);
    
          request.onerror = () => {
            reject(Error('Error al eliminar el objeto del almacén'));
          };
    
          request.onsuccess = () => {
            resolve(true);
          };
        });
      };
  
      // Buscar un dato en un almacén
    const find = (storeName, searchCriteria) => {
      return new Promise((resolve, reject) => {
        const store = getStore(storeName, 'readonly');
        const request = store.openCursor();
  
        request.onerror = () => {
          reject(Error('Error al buscar en el almacén'));
        };
  
        let foundData = false;
  
        request.onsuccess = (event) => {
          const cursor = event.target.result;
  
          if (cursor) {
            const data = cursor.value;
            // Implementa tu lógica de búsqueda aquí
            if (matchesSearchCriteria(data, searchCriteria)) {
            //if (obCompare(data, searchCriteria)) {
              foundData = data;
              cursor.continue();
            } else {
              cursor.continue();
            }
          } else {
            resolve(foundData);
          }
        };
      });
    };

    //isIn, busca si un valor esta dentro de una celda
    const search = (storeName, searchCriteria) => {
      return new Promise((resolve, reject) => {
        
        // Asumimos que getStore existe y devuelve el objectStore
        const store = getStore(storeName, 'readonly');
        const request = store.openCursor();
        const resultados = [];

        request.onerror = () => reject(Error('Error al abrir cursor'));

        request.onsuccess = (event) => {
          const cursor = event.target.result;

          if (cursor) {
            const data = cursor.value;
            let cumpleTodosLosCampos = true; 

            // Iteramos sobre cada campo del criterio (ej: "nombre", "edad")
            for (const key in searchCriteria) {
              
              // --- SECCIÓN NUEVA: Normalización de búsqueda ---
              // Si el criterio es ["oso", "loro"], usamos ese array.
              // Si el criterio es "oso", lo convertimos a ["oso"] para usar la misma lógica.
              const rawCriteria = searchCriteria[key];
              const terminosDeBusqueda = Array.isArray(rawCriteria) ? rawCriteria : [rawCriteria];
              
              const valorDelDato = data[key]; // El valor en la base de datos (String o Array)
              let seEncontroAlgunaCoincidencia = false;

              // Iteramos sobre cada término ("oso", luego "loro")
              // Si AL MENOS UNO coincide, este campo es válido.
              for (const termino of terminosDeBusqueda) {
                const terminoLimpio = String(termino).toLowerCase();

                if (typeof valorDelDato === 'string') {
                  // Lógica String: Subcadena
                  if (valorDelDato.toLowerCase().includes(terminoLimpio)) {
                    seEncontroAlgunaCoincidencia = true;
                    break; // Encontramos uno, no hace falta buscar el otro
                  }
                } 
                else if (Array.isArray(valorDelDato)) {
                  // Lógica Array: Coincidencia exacta dentro del array
                  const existe = valorDelDato.some(item => 
                    String(item).toLowerCase() === terminoLimpio
                  );
                  if (existe) {
                    seEncontroAlgunaCoincidencia = true;
                    break; 
                  }
                }
              }
              // --- FIN SECCIÓN NUEVA ---

              // Si probamos "oso" y "loro" y ninguno coincidió, este registro no sirve.
              if (!seEncontroAlgunaCoincidencia) {
                cumpleTodosLosCampos = false;
                break;
              }
            }

            if (cumpleTodosLosCampos) {
              resultados.push(data);
            }

            cursor.continue();
          } else {
            resolve(resultados);
          }
        };
      });
    };
    
    // Implementa tu lógica de búsqueda aquí
    const matchesSearchCriteria = (data, searchCriteria) => {
      for (const key in searchCriteria) {
        if (data[key] !== searchCriteria[key]) {
          return false;
        }
      }
      return true;
    };
  
    //borrar base de datos
    const kill= function (){
      // db.deleteDatabase(); 
      
        indexedDB.deleteDatabase(db.name)
        window.location.reload()
      
      
    }

    const removeAll = (storeName, key) => {
      return new Promise((resolve, reject) => {
          const store = getStore(storeName, 'readwrite');
          readAll(storeName)
              .then((data:any) => data.forEach(i => remove(storeName, i[key])));
      });
    };
  
    //comparar objetos (avaluar pasar a JappM)
    const obCompare = function (obj1, obj2) {
      // Verificar si ambos objetos son del mismo tipo
      if (typeof obj1 !== typeof obj2) {
        return false;
      }
    
      // Verificar si son objetos o null
      if (typeof obj1 !== 'object' || obj1 === null || obj2 === null) {
        return obj1 === obj2;
      }
    
      // Obtener las claves de ambos objetos
      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);
    
      // Verificar si tienen la misma cantidad de claves
      if (keys1.length !== keys2.length) {
        return false;
      }
    
      // Verificar si las claves son las mismas
      if (!keys1.every((key) => keys2.includes(key))) {
        return false;
      }
    
      // Verificar recursivamente los valores de cada campo
      for (const key of keys1) {
        if (!obCompare(obj1[key], obj2[key])) {
          return false;
        }
      }
      return true;
    }
    
      return {
        readFirst,
        abrir,
        create,
        read,
        readAll,
        update,
        remove,
        find, //busca coincidencias
        kill,
        nextno,
        removeAll,
        search //busca en subcadenas o arrays
      };
    })();
  
  export default Dbase
  