import './App.css';
import Alert from 'react-bootstrap/Alert';
import { useState } from 'react';
import ModalInfo from './components/useModalInfo';
import { useFetch } from './components/useFetch';
import { Button } from 'react-bootstrap';
import ModalAdd from './components/useModalAdd';
import Form from 'react-bootstrap/Form';

function App() {
  //consulta la información de las entradas
  let {data, loading, error} = useFetch('http://127.0.0.1:8000/api/entradas');

  //hook y funciones para mostrar el modal de información
  const [showModalInfo, setShowModalInfo] = useState(false);
  const cerrarModalInfo = () => setShowModalInfo(false);
  const mostrarModalInfo = () => setShowModalInfo(true);
  
  //hooks para pasar los datos al modal info
  const [errorEntrada, setErrorEntrada] = useState(null);
  const [datosEntrada, setDatosEntrada] = useState(null);
  const [cargando, setCargando] = useState(true);

  //hooks para el modal de nueva entrada
  const [showModalAdd, setShowModalAdd] = useState(false);
  const cerrarModalAdd = () => setShowModalAdd(false);
  const mostrarModalAdd = () => setShowModalAdd(true);

  //hook para la busqueda de datos
  const [busqueda, setBusqueda] = useState('');
  const [selectBusq, setSelectBusq] = useState(1);

  //función para cargar los datos de la entrada en el modal
  const cargarDatos = (event) => {
    //saca el dato para buscar la entrada y muestra el modal
    const value = event.target.getAttribute("data-index");
    mostrarModalInfo();

    setCargando(true);
    fetch('http://127.0.0.1:8000/api/entradas/' + value)
          .then((response) => response.json())
          .then((data) => setDatosEntrada(data))
          .catch((err) => setErrorEntrada(err))
          .finally(() => setCargando(false));
  }

  // función para filtrar entre los registros
  function buscarEntradas() {
    return (x) => {
      switch(parseInt(selectBusq)) {
        case 1:
          return x.titulo.toString().toLowerCase().includes(busqueda) || !busqueda;
          
        case 2:
          return x.autor.toString().toLowerCase().includes(busqueda) || !busqueda;
          
        default:
          return x.contenido.toString().toLowerCase().includes(busqueda) || !busqueda;
      }
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2 className='nombreBlog'>Blog de Héctor Beltrán | <Button variant="light" className='btnAgregar' onClick={mostrarModalAdd}>Nuevo</Button>
          <div className='inputBusqueda'>
            <Form.Control type="text" placeholder="Busqueda" value={busqueda} onChange={(busqueda) => setBusqueda(busqueda.target.value)} />
          </div>
          <div className='selectBusqueda'>
            <Form.Select aria-label="Default select example" onChange={(select) => setSelectBusq(select.target.value)}>
              <option value="1">Título</option>
              <option value="2">Autor</option>
              <option value="3">Contenido</option>
            </Form.Select>
          </div>
        </h2>
      </header>
      <div className='App-body'>
        <div className='App-body-content'>
        
        {error && <Alert variant='danger'>Error: {error}</Alert>}
        {loading && <Alert variant='info'>Cargando...</Alert>}
        {!loading && data?.entradas.filter(buscarEntradas()).map((entrada) => (
          <Alert key={entrada.idEntrada} variant='light' className='alertEntrada'>
            <h3 data-index={entrada.idEntrada} onClick={cargarDatos} className='tituloEntrada'>{entrada.titulo}</h3>
            {entrada.autor}
            <br></br>
            {entrada.fechaPublicacion}
            <br></br>
            {entrada.contenido}
          </Alert>
        ))}

        <ModalInfo showModal={showModalInfo} cerrarModal={cerrarModalInfo} datosEntrada={datosEntrada} errorEntrada={errorEntrada} cargando={cargando}></ModalInfo>

        <ModalAdd showModal={showModalAdd} cerrarModal={cerrarModalAdd}></ModalAdd>

        </div>
      </div>
    </div>
  );
}


export default App;
