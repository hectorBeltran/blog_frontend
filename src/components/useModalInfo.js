import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';

const ModalInfo = ({showModal, cerrarModal, datosEntrada, errorEntrada, cargando}) => {
  return (
    <>
      <Modal show={showModal} onHide={cerrarModal}>
        {errorEntrada && <Alert variant='danger'>Error: {errorEntrada}</Alert>}
        {cargando && <Alert variant='info'>Cargando...</Alert>}
        {!cargando && 
          <>
            <Modal.Header closeButton>
              <Modal.Title><h3 className='tituloEntrada tituloContent'>{datosEntrada?.entrada.titulo}</h3></Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {datosEntrada?.entrada.autor}
              <br></br>
              {datosEntrada?.entrada.fechaPublicacion}
              <br></br>
              <br></br>
              {datosEntrada?.entrada.contenido}
            </Modal.Body>
          </>
        }
      </Modal>
    </>
  );
};

export default ModalInfo;