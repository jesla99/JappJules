import React from '../libs/MiReact.js'
import JappN from '../libs/JappN.js'

class Diapositiva extends JappN {
    alCargar(props) {
        const nombre = props.nombre || 'Diapositiva sin nombre';
        return (
            <div class="slide">
                {nombre}
            </div>
        )
    }
}

export default Diapositiva
