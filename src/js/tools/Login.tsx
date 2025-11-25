import JappN from "../libs/JappN.js";
import React from "../libs/MiReact.js";
import Rest from "../libs/Rest.js";
//import Menu from "./Menu.js";
// @ts-ignore
const Swal = window.Swal;

export default class Login extends JappN {
  alCargar() {
    return (
      <div class="row">
        <br />
        <br />
        <div class="col c12 c">
          <img
            src="/src/js/vistas/img/rana.png"
            class="reducirimagen"
            id="LogoRana"
          />
        </div>
        <br />
        <div class="login-container">
          <h2 class="title-white">Inicio de Sesión</h2>
          <div>
            <br />
            <input type="text" id="usuario" placeholder="Usuario" required />
          </div>
          <br />
          <div>
            <input
              type="password"
              id="contrasena"
              placeholder="Contraseña"
              required
            />
          </div>
          <br />
          <div id="contenedorApp">
            <select id="select-app"></select>
          </div>
          <br />
          <br />
          <button class="btn-login" onClick={(e) => this.iniciarSesion(e)}>
            Login
          </button>
        </div>
      </div>
    );
  }

  alCargado() {
    const rest = new Rest({ superReq: true });
    rest
      .get("/Usuario/apps")
      .then((data) => {
        const apps = Array.isArray(data.res) ? data.res : [];
        this.mostrarApps(apps);
      })
      .catch((err) => {
        console.error("Error al cargar sucursales:", err);
      });
  }
  mostrarApps(apps) {
    const select = this.$("#select-app")[0];
    select.innerHTML = "";

    if (!apps || apps.length === 0) {
      select.appendChild(<option disabled selected value="" />);
      return;
    }

    select.appendChild(
      <option disabled selected value="">
        Seleccione una aplicación
      </option>
    );

    apps.forEach((app) => {
      select.appendChild(<option value={app.app_id}>{app.nombre}</option>);
    });
  }
  iniciarSesion(e) {
    e.preventDefault();
    const usuario = this.$("#usuario")[0]?.value.trim();
    const clave = this.$("#contrasena")[0]?.value.trim();
    const app_id = this.$("#select-app")[0]?.value;

    if (!usuario || !clave || !app_id) {
      Swal.fire({
        icon: "warning",
        title: "Campos vacíos",
        text: "Todos los campos son obligatorios.",
      });
      return;
    }

    const rest = new Rest({ superReq: true });

    rest.post("/Usuario/login", { usuario, clave, app_id }).then((data) => {
      if (data.error) {
        console.log("Muestra error: ", data.error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.error || "Error desconocido.",
        });
        return;
        
      } else if (data.token) {

        // Obtener información del usuario
        const restUser = new Rest({ superReq: true });
        restUser
          .get(`/Usuario/get/`)
          .then((usuarioData) => {
            const datosusuario = {
              suc_id: usuarioData.suc_id,
              suc_nombre: usuarioData.suc_nombre,
            };

            //this.Cargar(<Menu bin={this} datos={datosusuario} />);
          })
          .catch((err) => {
            console.error("Error al obtener datos del usuario:", err);
          });
      }
    });
  }
}
