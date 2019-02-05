import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import createHistory from "history/createBrowserHistory";
import { Provider, connect } from "react-redux";
import { ThemeProvider } from "emotion-theming";
import MapContainer from "./mapContainer";
import SidebarContainer from "./sidebarContainer";
import Header from "./header";
import styled from "react-emotion";
import theme from "../styles/theme";
import { store } from "../state/configureStore";
import "../styles/fonts.css";

const history = createHistory();

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

class Child extends React.Component {
  getUrlString() {
    const { trails, boundary, handles } = this.props;
    let string = "/?";
    if (boundary) string = string + `boundary=${boundary.id}`;
    if (trails.length)
      string =
        string +
        "trails=" +
        encodeURIComponent(JSON.stringify(trails.map(t => t.id)));
    if (handles.length)
      string =
        string +
        "handles=" +
        encodeURIComponent(
          JSON.stringify(handles.map(h => [h.index, h.trailId]))
        );
    return string;
  }

  componentDidUpdate() {
    history.push(this.getUrlString());
  }

  render() {
    return this.props.children;
  }
}

Child.propTypes = {
  trails: PropTypes.array,
  boundary: PropTypes.object,
  handles: PropTypes.array,
  children: PropTypes.node
};

const mapStateToProps = state => {
  const sortedTrails = state.trails
    .filter(t => t.selected)
    .sort((a, b) => a.selectedId - b.selectedId);
  const boundary = state.boundaries.find(t => t.selected);

  return {
    trails: sortedTrails,
    boundary: boundary,
    handles: state.handles
  };
};

const ConnectStateToRoute = connect(mapStateToProps)(Child);

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <div>
        <ConnectStateToRoute>
          <Body>
            <Header />
            <MapContainer />
            <SidebarContainer />
          </Body>
        </ConnectStateToRoute>
      </div>
    </ThemeProvider>
  </Provider>,
  document.getElementById("app")
);
