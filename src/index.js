import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {ApolloClient, InMemoryCache, ApolloProvider} from "@apollo/client";
import reducer, { initialState } from './Reducer';
import { StateProvider } from './StateProvider';

const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql',
  cache: new InMemoryCache()
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
