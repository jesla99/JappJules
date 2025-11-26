import React from '../libs/MiReact.js'
import JappN from '../libs/JappN.js'

class Diapositiva extends JappN {
    alCargar(props) {
        const title = props.title || 'Diapositiva sin título';
        return (
            <div class="slide">
                {title}
            </div>
        )
    }
}

export default Diapositiva