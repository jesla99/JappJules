import React from '../libs/MiReact.js'
import JappN from '../libs/JappN.js'
import Diapositiva from './Diapositiva.js'
import Elemento from './Elemento.js'

class Inicio extends JappN{
    constructor() {
        super()
        this.diapositivas = []
        this.diapositivaActiva = null
        this.elementoActivo = null
    }
    
    alCargar(props){
        if (props.diapositivas !== undefined) this.diapositivas = props.diapositivas;
        if (props.diapositivaActiva !== undefined) this.diapositivaActiva = props.diapositivaActiva;
        if (props.elementoActivo !== undefined) this.elementoActivo = props.elementoActivo;

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
                <div class="center-panel-container">
                    <div class="toolbar">
                        <button onClick={() => this.addElemento('text')}>Añadir Cuadro de Texto</button>
                    </div>
                    <div id="center-panel" class="center-panel">
                        {this.diapositivaActiva ?
                            this.diapositivaActiva.elements.map(el =>
                                <Elemento key={el.id} element={el} onClick={() => this.seleccionarElemento(el)} />
                            ) : <h1>Seleccione una diapositiva</h1>
                        }
                    </div>
                </div>
                <div id="right-panel" class="right-panel">
                    <h2>Propiedades</h2>
                    {this.renderPanelPropiedades()}
                </div>
            </div>
        </div>
    }

    renderPanelPropiedades() {
        if (this.elementoActivo) {
            return <div>
                <h3>Propiedades del Elemento</h3>
                <label>Contenido:</label>
                <input
                    type="text"
                    value={this.elementoActivo.content}
                    onChange={(e) => this.actualizarElemento('content', e.target.value)}
                />
            </div>
        }
        if (this.diapositivaActiva) {
            return <div>
                <h3>Propiedades de la Diapositiva</h3>
                <label>Título:</label>
                <input
                    type="text"
                    value={this.diapositivaActiva.title}
                    onChange={(e) => this.actualizarTituloDiapositiva(e.target.value)}
                />
                <p>ID: {this.diapositivaActiva.id}</p>
            </div>
        }
        return <p>Ninguna diapositiva seleccionada</p>
    }

    addDiapositiva() {
        const nuevaDiapositiva = { id: Date.now(), title: `Diapositiva ${this.diapositivas.length + 1}`, elements: [] };
        const nuevasDiapositivas = [...this.diapositivas, nuevaDiapositiva];
        this.rerender({ diapositivas: nuevasDiapositivas, diapositivaActiva: nuevaDiapositiva, elementoActivo: null });
    }

    addElemento(type) {
        if (!this.diapositivaActiva) return;
        const nuevoElemento = { id: Date.now(), type, content: 'Nuevo Texto', x: 50, y: 50 };
        const diapositivaActualizada = { ...this.diapositivaActiva, elements: [...this.diapositivaActiva.elements, nuevoElemento] };
        const diapositivasActualizadas = this.diapositivas.map(d => d.id === diapositivaActualizada.id ? diapositivaActualizada : d);
        this.rerender({ diapositivas: diapositivasActualizadas, diapositivaActiva: diapositivaActualizada, elementoActivo: nuevoElemento });
    }

    actualizarElemento(prop, value) {
        if (!this.elementoActivo) return;
        const elementoActualizado = { ...this.elementoActivo, [prop]: value };
        const diapositivaActualizada = {
            ...this.diapositivaActiva,
            elements: this.diapositivaActiva.elements.map(el => el.id === elementoActualizado.id ? elementoActualizado : el)
        };
        const diapositivasActualizadas = this.diapositivas.map(d => d.id === diapositivaActualizada.id ? diapositivaActualizada : d);
        this.rerender({ diapositivas: diapositivasActualizadas, diapositivaActiva: diapositivaActualizada, elementoActivo: elementoActualizado });
    }

    actualizarTituloDiapositiva(newTitle) {
        if (!this.diapositivaActiva) return;
        const diapositivaActualizada = { ...this.diapositivaActiva, title: newTitle };
        const diapositivasActualizadas = this.diapositivas.map(d => d.id === diapositivaActualizada.id ? diapositivaActualizada : d);
        this.rerender({ diapositivas: diapositivasActualizadas, diapositivaActiva: diapositivaActualizada, elementoActivo: this.elementoActivo });
    }

    seleccionarDiapositiva(diapositiva) {
        this.rerender({ diapositivas: this.diapositivas, diapositivaActiva: diapositiva, elementoActivo: null });
    }

    seleccionarElemento(elemento) {
        this.rerender({ diapositivas: this.diapositivas, diapositivaActiva: this.diapositivaActiva, elementoActivo: elemento });
    }

    rerender(newState) {
        if (!this.el || !this.el.parentElement) return;
        const newComponentInstance = <Inicio
            diapositivas={newState.diapositivas}
            diapositivaActiva={newState.diapositivaActiva}
            elementoActivo={newState.elementoActivo}
        />;
        this.Cargar(newComponentInstance, this.el.parentElement);
    }
}

export default Inicio