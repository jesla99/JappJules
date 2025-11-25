import JappN from "../../libs/JappN.js";
import React from "../../libs/MiReact.js";
import Rest from "../../libs/Rest.js";
import Dialogo from "../Dialogo.js";
import Input from "./Input.js";
import { restDefault } from "../../vistas/bin/env.js";
import Dbase from "../../libs/dBase.js";

export default class MetaSelect extends JappN {
// version 1.0.4 Se puede mostrar un dato del objeto en específico en pantalla.
// version 1.0.5 Carga una seleccion específica definida en los parametros.
// version 1.0.6 local deprecate, se cambio por restLevel.

  version = "1.0.6"; 
  llave; //en nombre de la llave primaria de la tabla
  endpoint; //ruta del endpoint que devolverá la data
  //local: boolean | number = 1; //indica si los datos se extran del backenlocal o remoto
  restLevel:0
  select;
  rest = new Rest(restDefault); //referencia a libreria rest
  callBack = (...e) => e; //funcion de retorno
  props; //backup de propiedades
  full = false;
  data = []; // almacena los datos de un objeto
  displayField; // muestra en pantalla un dato en específico
  selectedValue = null;// Aplica seleccion definida en los parametros.
  returnObject = false; // agregado
  flag;
  mask = "*"; //mascara de campos a procesar.

  alCargar(props) {
    this.full = props.full ?? false;
    this.llave = props.llave ?? false;

    this.displayField = props.displayField ?? null; // Lee un dato en específico
    this.returnObject = props.returnObject ?? false; //Leer la nueva propiedad
    this.selectedValue = props.selectedValue ?? null;// valor preseleccionado

    if (props.restLevel != undefined) this.rest.restLevel = props.restLevel;
    else this.rest.restLevel = this.restLevel;

    this.flag = props.flag != undefined ? undefined : undefined;
    this.mask = props.mask ?? "*";

    if (props.callBack != undefined) this.callBack = props.callBack;

    this.props = props;

    if (props["endpoint"] == undefined)
      return <div>Error, el modulo de MetaSelect, requiere un endpoint</div>;

    if (props["id"] == undefined)
      return <div>Error, el modulo de MetaSelect, requiere un id.</div>;

    const internas = ["endpoint", "bin", "restLevel", "callBack"];
    internas.forEach((i) => {
      if (props[i] != undefined) {
        this[i] = props[i];
        delete props[i];
      }
    });

    return (
      <div
        class={
          "_trj MetaSelect " + (props.class == undefined ? "" : props.class)
        }
        id={props.id}
      >
        <span>{props.etiqueta ?? ""}</span>
        <select>
          <option select>Seleccione una opcion</option>
        </select>
        {this.full ? (
          <b class="icon-search" onClick={() => this.buscar()}></b>
        ) : (
          ""
        )}
        {this.full ? (
          <b class="icon-plus" onClick={() => this.nuevo()}></b>
        ) : (
          ""
        )}
      </div>
    );
    /*
        return <div class="MetaSelect _campo" value="">
            <select></select>&nbsp;<span class="icon-plus"></span>
        </div>
        */
  }

  alCargado(el, props) {
    this["el"] = el;
    for (let i in props) {
      el[i] = props[i];
    }

    this.select = el.querySelector("select");

    this.rest
      .get(
        this.endpoint +
          (this.flag != undefined
            ? "/" + this.flag + "?campos=" + props.mask
            : "")
      )
      .then((data) => {
        //Guardar el array completo del API
        if (data.res) {
          this.data = data.res;
        } else {
          this.data = data;
        }
        if (data.error != "") {
          this.select.append(<option value="-1">Error</option>);
        } else {
          if (!this.llave ) {
            this.llave = Object.keys(data.res[0])[0];
          } 
          this.props["tabla"] = this.llave.substring(0, this.llave.length - 3);

          data.res.map((i) => {
            const key = i[this.llave];
            let label = "";

            if (this.displayField) {
              // Lógica para mostrar un dato en pantalla.
              label = i[this.displayField];
            } else {
              // Lógica original
              for (let k in i) {
                if (k != this.llave) {
                  label += i[k] + " ";
                }
              }
            }

            return this.select.append(<option value={key}>{label}</option>);
          });

          // Aplica seleccion despues de cargar los valores
          if (this.selectedValue !== null) {    
              this.select.value = this.selectedValue; 
             
          }
        }

        el.setAttribute("value", this.select.value);

        this.select.addEventListener("change", (e) => {
          el.setAttribute("value", e.target.value);
          if (this.returnObject) {
            const selectedId = e.target.value;
            // Buscar el objeto completo usando la llave (ID) y el array this.data
            const selectedObject = this.data.find(
              (item) => item[this.llave] == selectedId
            );
            this.callBack(selectedObject); // Pasar el objeto
          } else {
            this.callBack(e); // Comportamiento por defecto (DOM)
          }
        });
      });
  }

  buscar() {
    const dlg = new Dialogo();

    const tag = dlg.alCargar({
      mensaje: (
        <div style="height:calc(100% - 15px)">
          <Input
            etiqueta="Criterio para búsqueda"
            onKeyUp={(e) => this.filtrar(e)}
          />
          <div
            class="resultado"
            style="overflow:auto;height:calc(100% - 110px)"
          ></div>
        </div>
      ),
      //botones:{Buscar:{}},
      bin: this,
      callBack: (data) => this.callBack(data),
      style: "height:80%",
    });

    document.querySelector("#root")?.append(tag);
    this.setJappFnd(tag, dlg);
    dlg.alCargado(tag);
  }

  Buscar(data, ret) {
    ret({ error: "" });
  }

  filtrar(e) {
    //migrar a api local y/o remota

    const criterio = {};
    if (this.props["criterio"] != undefined)
      criterio[this.props.criterio] = e.target.value.trim();
    const res = e.target.parentNode.parentNode.querySelector(".resultado");
    Dbase.readAll(this.props.tabla, criterio).then((data: any) => {
      res.innerHTML = "";
      if (data.length == 0) res.innerHTML = "No hay resultado.";
      else {
        const btn =
          e.target.parentNode.parentNode.parentNode.parentNode.querySelector(
            "button"
          );
        res.append(
          ...data.map((i) => (
            <div
              class="item"
              onClick={() => this.seleccionar(i[this.llave], btn)}
            >
              {i[this.props.criterio]}
            </div>
          ))
        );
      }
    });
  }

  seleccionar(id, btn) {
    //Falta agregar marca al top 20 que se usará cuando el listado sea mayor a 20
    this.select.value = id;
    btn.click();
  }

  nuevo() {
    const dlg = new Dialogo();

    const form =
      this.props["form"] != undefined ? (
        this.props["form"]
      ) : (
        <Input
          id="valor"
          class="_campo"
          placeHolder="Valor para el nuevo registro."
          etiqueta={
            this.props["etiqueta"] == undefined
              ? "Nuevo registro"
              : this.props["etiqueta"]
          }
        />
      );

    const tag = dlg.alCargar({
      mensaje: form,
      botones: { Guardar: {} },
      bin: this,
      callBack: (data) => this.callBack(data),
    });

    document.querySelector("#root")?.append(tag);
    this.setJappFnd(tag, dlg);
    dlg.alCargado(tag);
  }

  Guardar(data) {
    //objeto a registrar
    //const valor = data.ctx.el.querySelector('input').value
    const valor = this.getCampos(data.ctx.el);
    //grabar valor
    const contexto = data.ctx;
    this.rest.post(this.endpoint, valor).then((data) => {
      if (data.error != "") {
        console.log(data);
        return data;
      } else {
        //Agregar al select
        this.select.append(<option value={data.id}>{data.valor}</option>);
        //seleccionar el valor nuevo
        this.select.value = data.id;
        this.select.parentNode.setAttribute("value", data.id);
        this.clearCampos(contexto.el);
        return data;
      }
    });
  }
}
