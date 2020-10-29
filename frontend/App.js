import * as React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './reducers';
import middlewares from './middlewares';

import AppEntry from './pages/AppEntry'

const store = createStore(rootReducer, middlewares);

export default function App() {  
  return (
    <Provider store={store}>
      <AppEntry />
    </Provider>
  );
}
