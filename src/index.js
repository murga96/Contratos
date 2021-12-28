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
const errorLink = onError( ({graphQLErrors, networkError, response}) => {
  if(graphQLErrors)
    graphQLErrors.map( ({message/* , locations, path */}) => alert(`[GraphQL error]: Message: ${message}`) )
  if(networkError)
    alert(`[Network error]: ${networkError}`)
  //no salte el error en la página
  console.log(networkError,"response")
  console.log(graphQLErrors,"response1")
  if(typeof response !== 'undefined' ){
    console.log("ddsdsds")
    response.errors = null;
  }/* else if(typeof networkError !== 'undefined' ){
    networkError = null
  }
 */
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
