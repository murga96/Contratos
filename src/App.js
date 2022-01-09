import './App.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import { SignIn } from './components/Login/SignIn';
import 'primeflex/primeflex.css'
import {Switch, BrowserRouter as Router, Route} from "react-router-dom"
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
        <Switch>
          <Route exact path="/">
            <Home/>
          </Route>
          <Route path="/TiposContratos">
            <ContractTypes/>
          </Route>
          <Route path="/TiposClausulas">
            <ClauseTypes/>
          </Route>
          <Route path="/TiposDocumentos">
            <DocumentTypes/>
          </Route>
          <Route path="/Cargos">
            <Cargos/>
          </Route>
          <Route path="/Ejecutivos">
            <Ejecutivos/>
          </Route>
          <Route path="/Incoterms">
            <Incoterms/>
          </Route>
          <Route path="/Monedas">
            <Monedas/>
          </Route>
          <Route path="/Puertos">
            <Puertos/>
          </Route>
          <Route path="/TiposCompras">
            <TiposDeCompras/>
          </Route>
          <Route path="/TiposContenedores">
            <TiposContenedor/>
          </Route>
          <Route path="/GruposCompra">
            <GruposDeCompras/>
          </Route>
          <Route path="/FormasPago">
            <Puertos/>
          </Route>
          <Route path="/FormasEntrega">
            <Puertos/>
          </Route>
          <Route path="/EtapasContratacion">
            <Puertos/>
          </Route>
          <Route path="/Inicio">
            <SignIn/>
          </Route>
        </Switch>
    </Router>
    </div>
  );
}

export default App;
