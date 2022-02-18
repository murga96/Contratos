import './App.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import { SignIn } from './components/Login/SignIn';
import 'primeflex/primeflex.css'
import { BrowserRouter as Router, Route, Routes, Outlet} from "react-router-dom"
import { Home } from './components/Home/Home';
import { ContractTypes } from './components/ContractTypes/ContractTypes';
import {addLocale, locale} from "primereact/api"
import { ClauseTypes } from './components/ClauseType/ClauseType';
import { DocumentTypes } from './components/Nom/DocumentTypes';
import { Cargos } from './components/Nom/Cargos';
import { Ejecutivos } from './components/Nom/Ejecutivos';
import { Incoterms } from './components/Nom/Icoterms';
import { Monedas } from './components/Nom/Monedas';
import { Puertos } from './components/Nom/Puertos';
import { TiposDeCompras } from './components/Nom/TiposDeCompras';
import { TiposContenedor } from './components/Nom/TiposContenedor';
import { GruposDeCompras } from './components/Nom/GruposDeCompras';
import { FormasEntrega } from './components/Nom/FormasEntregas';
import { EtapasContratacion } from './components/Nom/EtapasContratacion';
import { FormasPago } from './components/Nom/FormasPago';
import { Users } from './components/User/User';
import { ChangePassword } from './components/User/ChangePassword';
import { BasesGenerales } from './components/BasesGenerales/BasesGenerales';
import { BaseGeneral } from './components/BasesGenerales/BaseGeneral';
import { BaseGeneralEdit } from './components/BasesGenerales/BaseGeneralEdit';

 

function App() {
  addLocale('es', {
    accept: "Si",
    addRule: "Agregar regla",
    apply: "Aplicar",
    cancel: "Cancelar",
    choose: "Elegir",
    clear: "Limpiar",
    contains: "Contiene",
    custom: "Defecto",
    dateAfter: "Fecha anterior a",
    dateBefore: "Fecha después de",
    dateFormat: "dd/mm/yy",
    dateIs: "Fecha igual",
    dateIsNot: "Fecha no es igual",
    dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    dayNamesMin:  ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
    dayNamesShort:  ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
    emptyFilterMessage: "No se encontraron resultados",
    emptyMessage: "No hay elementos disponibles",
    endsWith: "Termina con",
    equals: "Igual",
    firstDayOfWeek: 1,
    gt: "Mayor que",
    gte: "Mayor igual que",
    lt: "Menor que",
    lte: "Menor igual que",
    matchAll: "Coinciden todos",
    matchAny: "Coinciden algunos",
    medium: "Medio",
    monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
    monthNamesShort:['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    noFilter: "Sin filtros",
    notContains: "No contiene",
    notEquals: "No igual a",
    passwordPrompt: "Teclee una contraseña",
    reject: "No",
    removeRule: "Elimina regla",
    startsWith: "Comienza con",
    strong: "Fuerte",
    today: "Hoy",
    upload: "Subida",
    weak: "Débil",
    weekHeader: "Semana",
  });

  locale('es');
  return (
    <div className="App">
    <Router>
        <Routes>
          <Route path="/" element={<Home/>}>
            <Route path="/TiposContratos" element={<ContractTypes/>}/>
            <Route path="/TiposClausulas" element={<ClauseTypes/>}/>
            <Route path="/TiposDocumentos" element={<DocumentTypes/>}/>
            <Route path="/Cargos" element={<Cargos/>}/>
            <Route path="/Ejecutivos" element={<Ejecutivos/>}/>
            <Route path="/Incoterms" element={<Incoterms/>}/>
            <Route path="/Monedas" element={<Monedas/>}/>
            <Route path="/Puertos" element={<Puertos/>}/>
            <Route path="/TiposCompras" element={<TiposDeCompras/>}/>
            <Route path="/TiposContenedores" element={<TiposContenedor/>}/>
            <Route path="/GruposCompra" element={<GruposDeCompras/>}/>
            <Route path="/FormasPago" element={<FormasPago/>}/>
            <Route path="/FormasEntrega" element={<FormasEntrega/>}/>
            <Route path="/EtapasContratacion" element={<EtapasContratacion/>}/>
            <Route path="/Usuarios" element={<Users/>}/>
            <Route path="/BasesGenerales" >
              <Route
                index
                element={
                  <BasesGenerales/>
                }
              />
              <Route path="/BasesGenerales/:operation/:BaseGeneral" element={<BaseGeneralEdit/>} />
              <Route path="/BasesGenerales/Detalle/:BaseGeneral" element={<BaseGeneral/>} />
            </Route>
          </Route>
          <Route path="/Inicio" element={<SignIn/>}/>
          <Route path="/CambiarContraseña" element={<ChangePassword/>}/>
          <Route path="*" element={
            <main style={{ padding: "1rem"}}>
              <h1>Página no encontrada</h1>
            </main>
          }/>
        </Routes>
    </Router>
    </div>
  );
}

export default App;
