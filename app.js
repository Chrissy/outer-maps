import React from 'react';
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import lastHoveredTrail from './lastHoveredTrail'
import Map from './map'

let store = createStore(lastHoveredTrail);

console.log(store.getState());

ReactDOM.render(
  <Provider store={store}>
    <Map />
  </Provider>,
  document.getElementById("app")
);
