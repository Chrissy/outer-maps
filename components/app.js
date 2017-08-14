import React from 'react';
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import {store} from '../state/configureStore';
import MapContainer from './mapContainer';
import Header from './header';
import styles from '../styles/app.css';
import clear from '../styles/clear.css';

ReactDOM.render(
  <Provider store={store}>
    <div>
      <div className={styles.body}>
        <Header />
        <MapContainer />
      </div>
    </div>
  </Provider>,
  document.getElementById("app")
);
