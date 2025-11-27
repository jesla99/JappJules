import React from '../libs/MiReact.js'
import JappN from '../libs/JappN.js'

class Elemento extends JappN {
    alCargar(props) {
        const { element, onClick } = props;

        const style = {
            position: 'absolute',
            left: `${element.x}px`,
            top: `${element.y}px`,
            cursor: 'pointer',
            border: '1px dashed #ccc',
            padding: '5px'
        };

        return (
            <div style={style} onClick={onClick}>
                {element.content}
            </div>
        )
    }
}

export default Elemento
