import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "emotion-theming";
import MapContainer from "./mapContainer";
import SidebarContainer from "./sidebarContainer";
import Header from "./header";
import Welcome from "./welcome";
import styled from "react-emotion";
import theme from "../styles/theme";
import { store } from "../state/configureStore";
import "../styles/fonts.css";

const Body = styled("div")`
  display: grid;
  grid-template-rows: ${p => p.theme.ss(2.5)} auto;
  position: absolute;
  height: 100%;
  width: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0;
  font-family: ${p => p.theme.bodyFont};
`;

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <div>
        <Body>
          <Header />
          <MapContainer />
          <SidebarContainer />
          <Welcome />
        </Body>
      </div>
    </ThemeProvider>
  </Provider>,
  document.getElementById("app")
);
