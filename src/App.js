import "./App.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { SignIn } from "./components/Login/SignIn";
import "primeflex/primeflex.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "./components/Home/Home";
import { ContractTypes } from "./components/ContractTypes/ContractTypes";
import { addLocale, locale } from "primereact/api";
import { ClauseTypes } from "./components/ClauseType/ClauseType";
import { DocumentTypes } from "./components/Nom/DocumentTypes";
import { Cargos } from "./components/Nom/Cargos";
import { Ejecutivos } from "./components/Nom/Ejecutivos";
import { Incoterms } from "./components/Nom/Icoterms";
import { Monedas } from "./components/Nom/Monedas";
import { Puertos } from "./components/Nom/Puertos";
import { TiposDeCompras } from "./components/Nom/TiposDeCompras";
import { TiposContenedor } from "./components/Nom/TiposContenedor";
import { GruposDeCompras } from "./components/Nom/GruposDeCompras";
import { FormasEntrega } from "./components/Nom/FormasEntregas";
import { EtapasContratacion } from "./components/Nom/EtapasContratacion";
import { FormasPago } from "./components/Nom/FormasPago";
import { Users } from "./components/User/User";
import { ChangePassword } from "./components/User/ChangePassword";
import { BasesGenerales } from "./components/BasesGenerales/BasesGenerales";
import { BaseGeneral } from "./components/BasesGenerales/BaseGeneral";
import { BaseGeneralEdit } from "./components/BasesGenerales/BaseGeneralEdit";
import { BaseGeneralAdd } from "./components/BasesGenerales/BaseGeneralAdd";
import { AuthContainer } from "./components/User/AuthContainer";
import {AuthenticateRoute} from "./components/User/ProtectedRoute"
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  from,
  HttpLink,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";

function App() {
  addLocale("es", {
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
    dayNames: [
      "domingo",
      "lunes",
      "martes",
      "miércoles",
      "jueves",
      "viernes",
      "sábado",
    ],
    dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
    dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
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
    monthNames: [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ],
    monthNamesShort: [
      "ene",
      "feb",
      "mar",
      "abr",
      "may",
      "jun",
      "jul",
      "ago",
      "sep",
      "oct",
      "nov",
      "dic",
    ],
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
  locale("es");
  
  const httpLink = new HttpLink({
    uri: "http://localhost:3001/graphql",
  });
  const authLink = setContext((_, { headers }) => {
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: localStorage.getItem("token") ? `Bearer ${localStorage.getItem("token")}` : "",
      },
    };
  });
  
  const handlingError = (error) => {
    console.log(error);
    if (error.includes("Error: Cannot insert duplicate key row")) {
      alert(
        "[Error] No se puede guardar elementos de valor único repetidos en la base de datos. Revise sus datos y restricciones."
      );
    } else if (
      error.includes(
        "Error: The DELETE statement conflicted with the REFERENCE constraint"
      )
    ) {
      alert(
        "[Error] No se puede eliminar elemento(s) que están siendo utilizados en la base de datos."
      );
    } else if (
      error.includes('Unexpected error value: "Usuario o contraseña incorrectos"')
    ) {
      return;
    } else if (error.includes("Unexpected error value:")) {
      alert(error.split("value: ")[1]);
    } else if (error.includes("Forbidden resource")) {
      alert("No tiene autorización para acceder a este recurso");
    }else {
      alert(`[GraphQL error]: Message: ${error}`);
    }
  };
  
  const errorLink = onError(
    ({ graphQLErrors, networkError, response, operation }) => {
      // console.log(graphQLErrors, networkError, response, operation)
      if (graphQLErrors) {
        graphQLErrors.map(({ message /* , locations, path */ }) => {
          handlingError(message);
          message = null;
          return undefined;
        });
      }
      // graphQLErrors = null
      if (networkError) {
        alert(`[Network error]: ${networkError}`);
        networkError = null;
      }
      //no salte el error en la página
      if (response) {
        response.errors = null;
      }
      // console.log(graphQLErrors, networkError, response, operation)
    }
  );
  const client = new ApolloClient({
    link: from([errorLink,authLink.concat(httpLink)]),
    cache: new InMemoryCache({ addTypename: false }),
    //   onError: (e) => {
    //     console.log(JSON.stringify(e, null, 2))
    //  },
  });
  
  return (
    <div className="App">
      <Router>
        <ApolloProvider client={client}>
        <AuthContainer.Provider>
          <Routes>
            <Route path="/" element={<Home />}>
              <Route path="/TiposContratos" element={<AuthenticateRoute component={ContractTypes} path="/TiposContratos"/>} />
              <Route path="/TiposClausulas" element={<AuthenticateRoute component={ClauseTypes} path="/TiposClausulas"/>} />
              <Route path="/TiposDocumentos" element={<AuthenticateRoute component={DocumentTypes} path="/TiposDocumentos"/>} />
              <Route path="/Cargos" element={<AuthenticateRoute component={Cargos} path="/Cargos"/>} />
              <Route path="/Ejecutivos" element={<AuthenticateRoute component={Ejecutivos} path="/Ejecutivos"/>} />
              <Route path="/Incoterms" element={<AuthenticateRoute component={Incoterms} path="/Incoterms"/>} />
              <Route path="/Monedas" element={<AuthenticateRoute component={Monedas} path="/Monedas"/>} />
              <Route path="/Puertos" element={<AuthenticateRoute component={Puertos} path="/Puertos"/>} />
              <Route path="/TiposCompras" element={<AuthenticateRoute component={TiposDeCompras} path="/TiposCompras"/>} />
              <Route path="/TiposContenedores" element={<AuthenticateRoute component={TiposContenedor} path="/TiposContenedores"/>} />
              <Route path="/GruposCompra" element={<AuthenticateRoute component={GruposDeCompras} path="/GruposCompra"/>} />
              <Route path="/FormasPago" element={<AuthenticateRoute component={FormasPago} path="/FormasPago"/>} />
              <Route path="/FormasEntrega" element={<AuthenticateRoute component={FormasEntrega} path="/FormasEntrega"/>} />
              <Route
                path="/EtapasContratacion"
                element={<AuthenticateRoute component={EtapasContratacion} path="/EtapasContratacion"/>}
              />
              <Route path="/Usuarios" element={<AuthenticateRoute component={Users} path="/Usuarios"/>} />
              <Route path="/BasesGenerales">
                <Route index element={<AuthenticateRoute component={BasesGenerales} path="/BasesGenerales"/>} />
                <Route
                  path="/BasesGenerales/Add/"
                  element={<AuthenticateRoute component={BaseGeneralAdd} path="/BasesGenerales/Add"/>}
                />
                <Route
                  path="/BasesGenerales/Edit/:BaseGeneral"
                  element={<AuthenticateRoute component={BaseGeneralEdit} path="/BasesGenerales/Edit"/>}
                />
                <Route
                  path="/BasesGenerales/Detalle/:BaseGeneral"
                  element={<AuthenticateRoute component={BaseGeneral} path="/BasesGenerales/Detalle"/>}
                />
              </Route>
            </Route>
            <Route path="/Inicio" element={<SignIn />} />
            <Route path="/CambiarContraseña" element={<AuthenticateRoute component={ChangePassword} path="/CambiarContraseña"/>} />
            <Route
              path="*"
              element={
                <main style={{ padding: "1rem" }}>
                  <h1>Página no encontrada</h1>
                </main>
              }
            />
          </Routes>
        </AuthContainer.Provider>
        </ApolloProvider>
      </Router>
    </div>
  );
}

export default App;
