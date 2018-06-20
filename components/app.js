import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "../state/configureStore";
import MapContainer from "./mapContainer";
import SidebarContainer from "./sidebarContainer";
import Header from "./header";
import Welcome from "./welcome";
import styles from "../styles/app.css";

ReactDOM.render(
  <Provider store={store}>
    <div>
      <div className={styles.body}>
        <Header />
        <MapContainer />
        <SidebarContainer />
        <Welcome />
      </div>
    </div>
  </Provider>,
  document.getElementById("app")
);
