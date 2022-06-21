import "./App.css";
import "primereact/resources/themes/saga-blue/theme.css";
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
import { AuthenticateRoute } from "./components/User/ProtectedRoute";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  from,
  HttpLink,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import { ProformaClausulas } from "./components/Nom/ProformaClausulas";
import { Proformas } from "./components/Proformas/Proformas";
import { Proforma } from "./components/Proformas/Proforma";
import { Compradores } from "./components/Nom/Compradores";
import { DatosEntidad } from "./components/Nom/DatosEntidad";
import {
  setApolloConfig,
  setAxiosConfig,
  setPrimeReactInitialConfig,
} from "./config";
import { Configuracion } from "./components/Configuracion/Configuracion";
import { Negociaciones } from "./components/Negociaciones/Negociaciones";
import { Negociacion } from "./components/Negociaciones/Negociacion";
import { NegociacionAdd } from "./components/Negociaciones/NegociacionAdd";
import { NegociacionEdit } from "./components/Negociaciones/NegociacionEdit";

function App() {
  setPrimeReactInitialConfig();
  const client = setApolloConfig();

  return (
    <div className="App">
      <Router>
        <ApolloProvider client={client}>
          <AuthContainer.Provider>
            <Routes>
              <Route path="/" element={<Home />}>
                <Route
                  path="/TiposContratos"
                  element={
                    <AuthenticateRoute
                      component={ContractTypes}
                      path="/TiposContratos"
                    />
                  }
                />
                <Route
                  path="/TiposClausulas"
                  element={
                    <AuthenticateRoute
                      component={ClauseTypes}
                      path="/TiposClausulas"
                    />
                  }
                />
                <Route
                  path="/TiposDocumentos"
                  element={
                    <AuthenticateRoute
                      component={DocumentTypes}
                      path="/TiposDocumentos"
                    />
                  }
                />
                <Route
                  path="/Cargos"
                  element={
                    <AuthenticateRoute component={Cargos} path="/Cargos" />
                  }
                />
                <Route
                  path="/Ejecutivos"
                  element={
                    <AuthenticateRoute
                      component={Ejecutivos}
                      path="/Ejecutivos"
                    />
                  }
                />
                <Route
                  path="/Incoterms"
                  element={
                    <AuthenticateRoute
                      component={Incoterms}
                      path="/Incoterms"
                    />
                  }
                />
                <Route
                  path="/Monedas"
                  element={
                    <AuthenticateRoute component={Monedas} path="/Monedas" />
                  }
                />
                <Route
                  path="/Puertos"
                  element={
                    <AuthenticateRoute component={Puertos} path="/Puertos" />
                  }
                />
                <Route
                  path="/TiposCompras"
                  element={
                    <AuthenticateRoute
                      component={TiposDeCompras}
                      path="/TiposCompras"
                    />
                  }
                />
                <Route
                  path="/TiposContenedores"
                  element={
                    <AuthenticateRoute
                      component={TiposContenedor}
                      path="/TiposContenedores"
                    />
                  }
                />
                <Route
                  path="/GruposCompra"
                  element={
                    <AuthenticateRoute
                      component={GruposDeCompras}
                      path="/GruposCompra"
                    />
                  }
                />
                <Route
                  path="/FormasPago"
                  element={
                    <AuthenticateRoute
                      component={FormasPago}
                      path="/FormasPago"
                    />
                  }
                />
                <Route
                  path="/FormasEntrega"
                  element={
                    <AuthenticateRoute
                      component={FormasEntrega}
                      path="/FormasEntrega"
                    />
                  }
                />
                <Route
                  path="/Compradores"
                  element={
                    <AuthenticateRoute
                      component={Compradores}
                      path="/Compradores"
                    />
                  }
                />
                <Route
                  path="/DatosEntidad"
                  element={
                    <AuthenticateRoute
                      component={DatosEntidad}
                      path="/DatosEntidad"
                    />
                  }
                />
                <Route
                  path="/ProformasClausulas"
                  element={
                    <AuthenticateRoute
                      component={ProformaClausulas}
                      path="/ProformasClausulas"
                    />
                  }
                />
                <Route
                  path="/EtapasContratacion"
                  element={
                    <AuthenticateRoute
                      component={EtapasContratacion}
                      path="/EtapasContratacion"
                    />
                  }
                />
                <Route
                  path="/Usuarios"
                  element={
                    <AuthenticateRoute component={Users} path="/Usuarios" />
                  }
                />
                <Route
                  path="/Configuracion"
                  element={
                    <AuthenticateRoute
                      component={Configuracion}
                      path="/Configuracion"
                    />
                  }
                />
                <Route path="/Negociaciones">
                  <Route
                    index
                    element={
                      <AuthenticateRoute
                        component={Negociaciones}
                        path="/Negociaciones"
                      />
                    }
                  />
                  <Route
                    path="/Negociaciones/Add/"
                    element={
                      <AuthenticateRoute
                        component={NegociacionAdd}
                        path="/Negociaciones/Add"
                      />
                    }
                  />
                  <Route
                    path="/Negociaciones/Edit/:Negociacion"
                    element={
                      <AuthenticateRoute
                        component={NegociacionEdit}
                        path="/Negociaciones/Edit"
                      />
                    }
                  />
                  <Route
                    path="/Negociaciones/Detalle/:Negociacion"
                    element={
                      <AuthenticateRoute
                        component={Negociacion}
                        path="/Negociaciones/Detalle"
                      />
                    }
                  />
                </Route>
                <Route path="/BasesGenerales">
                  <Route
                    index
                    element={
                      <AuthenticateRoute
                        component={BasesGenerales}
                        path="/BasesGenerales"
                      />
                    }
                  />
                  <Route
                    path="/BasesGenerales/Add/"
                    element={
                      <AuthenticateRoute
                        component={BaseGeneralAdd}
                        path="/BasesGenerales/Add"
                      />
                    }
                  />
                  <Route
                    path="/BasesGenerales/Edit/:BaseGeneral"
                    element={
                      <AuthenticateRoute
                        component={BaseGeneralEdit}
                        path="/BasesGenerales/Edit"
                      />
                    }
                  />
                  <Route
                    path="/BasesGenerales/Detalle/:BaseGeneral"
                    element={
                      <AuthenticateRoute
                        component={BaseGeneral}
                        path="/BasesGenerales/Detalle"
                      />
                    }
                  />
                </Route>
                <Route path="/Proformas">
                  <Route
                    index
                    element={
                      <AuthenticateRoute
                        component={Proformas}
                        path="/Proformas"
                      />
                    }
                  />
                  <Route
                    path="/Proformas/Detalle/:Proforma"
                    element={
                      <AuthenticateRoute
                        component={Proforma}
                        path="/Proformas/Detalle"
                      />
                    }
                  />
                </Route>
              </Route>
              <Route path="/Inicio" element={<SignIn />} />
              <Route
                path="/CambiarContrasenna"
                element={
                  <AuthenticateRoute
                    component={ChangePassword}
                    path="/CambiarContraseña"
                  />
                }
              />
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
