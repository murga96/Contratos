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
const errorLink = onError( ({graphQLErrors, networkError, response, operation}) => {
  console.log(graphQLErrors, networkError, response, operation)
  if(graphQLErrors){
    graphQLErrors.map( ({message/* , locations, path */}) => {alert(`[GraphQL error]: Message: ${message}`);message=null} )
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
  console.log(graphQLErrors, networkError, response, operation)
})
const client = new ApolloClient({
  
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache({addTypename: false}),
//   onError: (e) => {
//     console.log(JSON.stringify(e, null, 2))
//  },
});

ReactDOM.render(
  // <React.StrictMode>
    <ApolloProvider client={client}>
    <StateProvider initialState= { initialState } reducer= { reducer }>
      <App />
    </StateProvider>
    </ApolloProvider>
  // </React.StrictMode>,
  ,document.getElementById('root')
);
