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
        this.nextId = 1
    }
    
    alCargar(props){
        if (props.diapositivas !== undefined) this.diapositivas = props.diapositivas;
        if (props.diapositivaActiva !== undefined) this.diapositivaActiva = props.diapositivaActiva;
        if (props.elementoActivo !== undefined) this.elementoActivo = props.elementoActivo;
        if (props.nextId !== undefined) this.nextId = props.nextId;

        return <div jcss="diapositiva.css">
            <div class="container">
                <div id="left-panel" class="left-panel">
                    <h2>Diapositivas</h2>
                    <button onClick={() => this.addDiapositiva()}>Nueva Diapositiva</button>
                    <div id="slide-list">
                        {this.diapositivas.map(d =>
                            <div key={d.id} onClick={() => this.seleccionarDiapositiva(d)}>
                                <Diapositiva nombre={d.nombre} />
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
                            <div class="slide-canvas">
                                {this.diapositivaActiva.data.elements.map(el =>
                                    <Elemento key={el.id} element={el} onClick={() => this.seleccionarElemento(el)} />
                                )}
                            </div>
                            : <h1>Seleccione una diapositiva</h1>
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
            return <div class="property-form">
                <h3>Propiedades del Elemento</h3>
                <label for="elementContent">Contenido:</label>
                <input
                    id="elementContent"
                    type="text"
                    value={this.elementoActivo.content}
                    onBlur={(e) => this.actualizarElemento('content', e.target.value)}
                />
            </div>
        }
        if (this.diapositivaActiva) {
            return <div class="property-form">
                <h3>Propiedades de la Diapositiva</h3>
                <label for="slideName">Nombre:</label>
                <input
                    id="slideName"
                    type="text"
                    value={this.diapositivaActiva.nombre}
                    onBlur={(e) => this.actualizarPropiedadDiapositiva('nombre', e.target.value)}
                />
                <label for="slideDescription">Descripción:</label>
                <textarea
                    id="slideDescription"
                    value={this.diapositivaActiva.descripcion}
                    onBlur={(e) => this.actualizarPropiedadDiapositiva('descripcion', e.target.value)}
                ></textarea>
                <label for="slideTypeId">Tipo ID:</label>
                <input
                    id="slideTypeId"
                    type="number"
                    value={this.diapositivaActiva.tipo_id}
                    onBlur={(e) => this.actualizarPropiedadDiapositiva('tipo_id', parseInt(e.target.value, 10))}
                />
            </div>
        }
        return <p>Ninguna diapositiva seleccionada</p>
    }

    addDiapositiva() {
        const nuevaDiapositiva = {
            id: this.nextId++,
            nombre: `Diapositiva ${this.diapositivas.length + 1}`,
            descripcion: "",
            tipo_id: 1,
            data: { elements: [] }
        };
        const nuevasDiapositivas = [...this.diapositivas, nuevaDiapositiva];
        this.rerender({ diapositivas: nuevasDiapositivas, diapositivaActiva: nuevaDiapositiva, elementoActivo: null, nextId: this.nextId });
    }

    addElemento(type) {
        if (!this.diapositivaActiva) return;
        const nuevoElemento = { id: this.nextId++, type, content: 'Nuevo Texto', x: 50, y: 50 };
        const diapositivaActualizada = { ...this.diapositivaActiva, data: { ...this.diapositivaActiva.data, elements: [...this.diapositivaActiva.data.elements, nuevoElemento] } };
        const diapositivasActualizadas = this.diapositivas.map(d => d.id === diapositivaActualizada.id ? diapositivaActualizada : d);
        this.rerender({ diapositivas: diapositivasActualizadas, diapositivaActiva: diapositivaActualizada, elementoActivo: nuevoElemento, nextId: this.nextId });
    }

    actualizarElemento(prop, value) {
        if (!this.elementoActivo) return;
        const elementoActualizado = { ...this.elementoActivo, [prop]: value };
        const diapositivaActualizada = {
            ...this.diapositivaActiva,
            data: { ...this.diapositivaActiva.data, elements: this.diapositivaActiva.data.elements.map(el => el.id === elementoActualizado.id ? elementoActualizado : el) }
        };
        const diapositivasActualizadas = this.diapositivas.map(d => d.id === diapositivaActualizada.id ? diapositivaActualizada : d);
        this.rerender({ diapositivas: diapositivasActualizadas, diapositivaActiva: diapositivaActualizada, elementoActivo: elementoActualizado, nextId: this.nextId });
    }

    actualizarPropiedadDiapositiva(prop, value) {
        if (!this.diapositivaActiva) return;
        const diapositivaActualizada = { ...this.diapositivaActiva, [prop]: value };
        const diapositivasActualizadas = this.diapositivas.map(d => d.id === diapositivaActualizada.id ? diapositivaActualizada : d);
        this.rerender({ diapositivas: diapositivasActualizadas, diapositivaActiva: diapositivaActualizada, elementoActivo: this.elementoActivo, nextId: this.nextId });
    }

    seleccionarDiapositiva(diapositiva) {
        this.rerender({ diapositivas: this.diapositivas, diapositivaActiva: diapositiva, elementoActivo: null, nextId: this.nextId });
    }

    seleccionarElemento(elemento) {
        this.rerender({ diapositivas: this.diapositivas, diapositivaActiva: this.diapositivaActiva, elementoActivo: elemento, nextId: this.nextId });
    }

    rerender(newState) {
        if (!this.el || !this.el.parentElement) return;
        const newComponentInstance = <Inicio
            diapositivas={newState.diapositivas}
            diapositivaActiva={newState.diapositivaActiva}
            elementoActivo={newState.elementoActivo}
            nextId={newState.nextId}
        />;
        this.Cargar(newComponentInstance, this.el.parentElement);
    }
}

export default Inicio
