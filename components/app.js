import React from 'react';
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import {store} from '../state/configureStore';
import MapContainer from '../components/mapContainer';

ReactDOM.render(
  <Provider store={store}>
    <MapContainer />
  </Provider>,
  document.getElementById("app")
);
