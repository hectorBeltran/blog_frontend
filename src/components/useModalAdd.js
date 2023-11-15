import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.module.css'
import { useState } from 'react';
import { registerLocale } from  "react-datepicker";
import es from 'date-fns/locale/es';
import Alert from 'react-bootstrap/Alert';

const ModalAdd = ({showModal, cerrarModal}) => {
    //datos para iniciar el datepicker
    registerLocale('es', es)
    const [startDate, setStartDate] = useState(new Date());

    //hooks para verificar la petición fetch
    const [errorEntrada, setErrorEntrada] = useState(null);
    const [datosEntrada, setDatosEntrada] = useState(null);
    const [cargando, setCargando] = useState(false);

    //hooks para el formulario
    const [titulo, setTitulo] = useState('');
    const [autor, setAutor] = useState('');
    const [contenido, setContenido] = useState('');

    //función para almacenar una entrada
    const guardarEntrada = () => {
        setCargando(true);
        const mes = startDate.getMonth() + 1;
        const fecha = startDate.getFullYear() + '-' + (mes.toString().length == 1 ? '0' + mes.toString() : mes) + '-' + startDate.getDate();
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                titulo: titulo,
                autor: autor,
                fechaPublicacion: fecha,
                contenido: contenido
            })
        };
        fetch('http://127.0.0.1:8000/api/entradas/', requestOptions)
            .then((response) => response.json())
            .then((data) => setDatosEntrada(data))
            .catch((err) => setErrorEntrada(err))
            .finally(() => setCargando(false));
    };

    return (
        <Modal show={showModal} onHide={cerrarModal}>
            <Modal.Header closeButton>
            <Modal.Title><h3 className='tituloEntradaNueva'>Nueva entrada</h3></Modal.Title>
            </Modal.Header>
            <Modal.Body>                
                <label>Título:</label>
                <Form.Control type="text" placeholder="Título" value={titulo} onChange={(titulo) => setTitulo(titulo.target.value)} />
                <br></br>
                <label>Autor:</label>
                <Form.Control type="text" placeholder="Autor" value={autor} onChange={(autor) => setAutor(autor.target.value)} />
                <br></br>
                <label className='fechaPub'>Fecha publicación:</label>
                <ReactDatePicker selected={startDate} onChange={(date) => setStartDate(date)} className='datePicker' locale='es' dateFormat='yyyy/MM/dd' disabledKeyboardNavigation maxDate={new Date()}></ReactDatePicker>
                <br></br>
                <br></br>
                <label>Contenido:</label>
                <Form.Control as="textarea" row={3} value={contenido} onChange={(contenido) => setContenido(contenido.target.value)} />
                <br></br>
                {errorEntrada && <Alert variant='danger'>Error: {errorEntrada}</Alert>}
                {cargando && <Alert variant='info'>Cargando...</Alert>}
                {datosEntrada?.resultado=='fail' && <Alert variant='warning'>{datosEntrada.mensaje}</Alert>}
                {!cargando && datosEntrada?.resultado=='ok' &&
                    <>
                        <Alert variant='success'>{datosEntrada.mensaje}</Alert>
                    </>
                }
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={cerrarModal}>
                Cerrar
            </Button>
            <Button variant="primary" onClick={guardarEntrada}>
                Guardar
            </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalAdd;