import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {ApolloClient, InMemoryCache, ApolloProvider, from, HttpLink} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import reducer, { initialState } from './Reducer';
import { StateProvider } from './StateProvider';

const httpLink = new HttpLink({
  uri: 'http://localhost:3001/graphql',
})

const handlingError = (error) => {
  console.log(error)
  if(error.includes("Error: Cannot insert duplicate key row")){
    alert("[Error] No se puede guardar elementos de valor único repetidos en la base de datos. Revise sus datos y restricciones.")
  }else if(error.includes("Error: The DELETE statement conflicted with the REFERENCE constraint")){
    alert("[Error] No se puede eliminar elemento(s) que están siendo utilizados en la base de datos.")
  } else if(error. includes("Unexpected error value: \"Usuario o contraseña incorrectos\"")){
    return
  }else if(error.includes("Unexpected error value:")){
    alert(error.split("value: ")[1])
  }
  else{
    alert(`[GraphQL error]: Message: ${error}`)
  }
}

const errorLink = onError( ({graphQLErrors, networkError, response, operation}) => {
  // console.log(graphQLErrors, networkError, response, operation)
  if(graphQLErrors){
    graphQLErrors.map( ({message/* , locations, path */}) => {handlingError(message); message=null} )
  }
  // graphQLErrors = null
  if(networkError){
    alert(`[Network error]: ${networkError}`)
    networkError = null
  }
  //no salte el error en la página
  if(response){
    response.errors = null;
  }
  // console.log(graphQLErrors, networkError, response, operation)
})
const client = new ApolloClient({
  
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache({addTypename: false}),
//   onError: (e) => {
//     console.log(JSON.stringify(e, null, 2))
//  },
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
    <StateProvider initialState= { initialState } reducer= { reducer }>
      <App />
    </StateProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
