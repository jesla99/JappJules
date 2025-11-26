import React from '../libs/MiReact.js'
import JappN from '../libs/JappN.js'
import Diapositiva from './Diapositiva.js'

class Inicio extends JappN{
    constructor() {
        super()
        // Default initial state
        this.diapositivas = []
        this.diapositivaActiva = null
    }
    
    // The alCargar method will now be responsible for setting the state
    // based on props, and then rendering.
    alCargar(props){
        // If props are passed, use them to set the state.
        // This allows us to "transfer" state during a rerender.
        if (props.diapositivas !== undefined) {
            this.diapositivas = props.diapositivas;
        }
        if (props.diapositivaActiva !== undefined) {
            this.diapositivaActiva = props.diapositivaActiva;
        }

        return <div jcss="diapositiva.css">
            <div class="container">
                <div id="left-panel" class="left-panel">
                    <h2>Diapositivas</h2>
                    <button onClick={() => this.addDiapositiva()}>Nueva Diapositiva</button>
                    <div id="slide-list">
                        {this.diapositivas.map(d =>
                            <div key={d.id} onClick={() => this.seleccionarDiapositiva(d)}>
                                <Diapositiva title={d.title} />
                            </div>
                        )}
                    </div>
                </div>
                <div id="center-panel" class="center-panel">
                    {this.diapositivaActiva ?
                        <Diapositiva title={this.diapositivaActiva.title} /> :
                        <h1>Seleccione una diapositiva</h1>
                    }
                </div>
                <div id="right-panel" class="right-panel">
                    <h2>Propiedades</h2>
                    {this.diapositivaActiva ?
                        <div>
                            <h3>{this.diapositivaActiva.title}</h3>
                            <p>ID: {this.diapositivaActiva.id}</p>
                        </div> :
                        <p>Ninguna diapositiva seleccionada</p>
                    }
                </div>
            </div>
        </div>
    }

    addDiapositiva() {
        const nuevaDiapositiva = {
            id: this.diapositivas.length + 1,
            title: `Diapositiva ${this.diapositivas.length + 1}`
        };
        const nuevasDiapositivas = [...this.diapositivas, nuevaDiapositiva];
        this.rerender({ diapositivas: nuevasDiapositivas, diapositivaActiva: this.diapositivaActiva });
    }

    seleccionarDiapositiva(diapositiva) {
        this.rerender({ diapositivas: this.diapositivas, diapositivaActiva: diapositiva });
    }

    rerender(newState) {
        if (!this.el || !this.el.parentElement) {
            return;
        }

        const newComponentInstance = <Inicio
            diapositivas={newState.diapositivas}
            diapositivaActiva={newState.diapositivaActiva}
        />;

        this.Cargar(newComponentInstance, this.el.parentElement);
    }
}

export default Inicio