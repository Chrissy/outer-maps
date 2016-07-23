import React from 'react';
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from './reducers'
import Map from './map'

let store = createStore(reducers);

ReactDOM.render(
  <Provider store={store}>
    <Map />
  </Provider>,
  document.getElementById("app")
);
