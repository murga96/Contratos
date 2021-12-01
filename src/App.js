import './App.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import {Navbar} from "./components/NavBar/Navbar"
 

function App() {

  return (
    <div className="App">
       <Navbar/>
       
       {/* <DataTable value={contracts} responsiveLayout="scroll">
          <Column field="TipoContrato" header="Tipo de Contrato"></Column>
        </DataTable> */}
    </div>
  );
}

export default App;
