import React from 'react';
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from './reducers'
import MapContainer from './mapContainer'

let store = createStore(reducers);

ReactDOM.render(
  <Provider store={store}>
    <MapContainer />
  </Provider>,
  document.getElementById("app")
);
