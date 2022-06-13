import PrimeReact from 'primereact/api';
import { addLocale, locale } from "primereact/api";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  from,
  HttpLink,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import { fireError } from './components/utils';


export const setPrimeReactInitialConfig = () => {
  //setting locale
  addLocale("es", {
    accept: "Si",
    addRule: "Agregar regla",
    apply: "Aplicar",
    cancel: "Cancelar",
    choose: "Elegir",
    clear: "Limpiar",
    contains: "Contiene",
    custom: "Defecto",
    dateAfter: "Fecha después de",
    dateBefore: "Fecha anterior a",
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
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
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
  //setting ripple effect
  PrimeReact.ripple = true;
}

export const setApolloConfig = () => {
  //setting default configs for axios
  const httpLink = new HttpLink({
    uri: process.env.REACT_APP_URL_API,
  });
  const authLink = setContext((_, { headers }) => {
    // return the headers to the context so httpLink can read them
    console.log(localStorage.getItem("token"))
    return {
      headers: {
        ...headers,
        // authorization: localStorage.getItem("token") ? `Bearer ${localStorage.getItem("token")}` : "",
        authorization:  `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjp7ImlkVXN1YXJpbyI6MTAzNywiaWRFamVjdXRpdm8iOjI5Mywibm9tYnJlVXN1YXJpbyI6ImRhbmllbC5hY29zdGEiLCJjb250cmFzZW5hIjoiOFVTTTEyNG0xWXlIeUU2bWhOOTZTZWNzNEFZNTc5T1NMdzhtY2JCbEUuODlXSDJYaDlLUDIiLCJ1c3VhcmlvUm9sZXMiOlt7ImlkVXN1YXJpb1JvbCI6MTA5NiwiaWRVc3VhcmlvIjoxMDM3LCJpZFJvbCI6MX0seyJpZFVzdWFyaW9Sb2wiOjEwOTUsImlkVXN1YXJpbyI6MTAzNywiaWRSb2wiOjJ9XSwiZWplY3V0aXZvIjp7ImlkRWplY3V0aXZvIjoyOTMsImlkR3J1cG8iOjEsIm5vbWJyZSI6IkRhbmllbCBEYXZpZCBBY29zdGEgSGVycmVyYSIsImlkQ2FyZ28iOjYsImNvcnJlbyI6ImRhbmllbC5hY29zdGFAdHJkY2FyaWJlLmNvLmN1IiwiYWN0aXZvIjp0cnVlfX0sImlhdCI6MTY0ODczOTMxNH0.y2mfS24RqG1U9s4sVBlMWNb1dg4m-4yXNYAa43co8mI`,
      },
    };
  });
  
  const handlingGraphQLError = (error) => {
    console.log(error);
    if (error.includes("Error: Cannot insert duplicate key row")) {
      fireError(
        "[Error] No se puede guardar elementos de valor único repetidos en la base de datos. Revise sus datos y restricciones."
      );
    } else if (
      error.includes(
        "Error: The DELETE statement conflicted with the REFERENCE constraint"
      )
    ) {
      fireError(
        "[Error] No se puede eliminar elemento(s) que están siendo utilizados en la base de datos."
      );
    } else if (
      error.includes('Unexpected error value: "Usuario o contraseña incorrectos"')
    ) {
      // return;
      fireError("Usuario o contraseña incorrectos")
    } else if (error.includes("Unexpected error value:")) {
      fireError(error.split("value: ")[1]);
    } else if (error.includes("Forbidden resource")) {
      fireError("No tiene autorización para acceder a este recurso");
    }else {
      fireError(`[GraphQL error]: Message: ${error}`);
    }
  };
  
  const errorLink = onError(
    ({ graphQLErrors, networkError, response, operation }) => {
      // console.log(graphQLErrors, networkError, response, operation)
      if (graphQLErrors) {
        graphQLErrors.map(({ message /* , locations, path */ }) => {
          handlingGraphQLError(message);
          message = null;
          return undefined;
        });
      }
      // graphQLErrors = null
      if (networkError) {
        if(networkError.message.includes("Failed to fetch")){
          fireError("Conexión fallida con el servidor")
          networkError = null;
        }
        else{
          fireError(`[Network error]: ${networkError}`);
          networkError = null;

        }
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
  return client;
}