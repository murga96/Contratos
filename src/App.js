import './App.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import { SignIn } from './components/Login/SignIn';
import 'primeflex/primeflex.css'
import {Routes, BrowserRouter as Router, Route} from "react-router-dom"
import { Navbar } from './components/NavBar/Navbar';
 

function App() {

  return (
    <div className="App">
    <Router>  
        <Routes>
            <Route path="/home" element={<Navbar/>}/>
            <Route path="/" element={<SignIn/>}/>
        </Routes>
    </Router>
       {/* <Navbar/> */}
       
       {/* <DataTable value={contracts} responsiveLayout="scroll">
          <Column field="TipoContrato" header="Tipo de Contrato"></Column>
        </DataTable> */}
    </div>
  );
}

export default App;
