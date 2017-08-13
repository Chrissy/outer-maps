import React from 'react';
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import {store} from '../state/configureStore';
import MapContainer from './mapContainer';
import Header from './header';

ReactDOM.render(
  <Provider store={store}>
    <div>
      <Header />
      <MapContainer />
    </div>
  </Provider>,
  document.getElementById("app")
);
