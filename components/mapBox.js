import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { fromJS, is } from "immutable";
import MapboxGL from "mapbox-gl";
import { accessToken } from "../data/mapboxStaticData";
import mapboxStyles from "../public/dist/mapbox-styles.json";
import debounce from "lodash.debounce";
import styled from "react-emotion";
const WATCH_EVENTS = [
  "mousedown",
  "mouseup",
  "click",
  "dblclick",
  "mousemove",
  "mouseenter",
  "mouseleave",
  "mouseover",
  "mouseout",
  "contextmenu",
  "touchstart",
  "touchend",
  "touchcancel"
];

export default class MapBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      popups: []
    };
  }

  updateSources(newSources = []) {
    newSources.forEach(
      function(source) {
        this.mapboxed.getSource(source.id).setData(source.data);
      }.bind(this)
    );
  }

  updateFeatureStates(featureStates, oldFeatureStates) {
    oldFeatureStates.forEach(feature => {
      const nullifyObject = Object.keys(feature.state).reduce((obj, val) => {
        return { ...obj, [val]: null };
      }, {});
      this.mapboxed.setFeatureState(feature, nullifyObject);
    });

    featureStates.forEach(feature => {
      this.mapboxed.setFeatureState(feature, feature.state);
    });
  }

  addPopups(popups) {
    const popElements = popups.map(({ content, lngLat }) => {
      const popupContainer = document.createElement("div");
      ReactDOM.render(content, popupContainer);
      const popup = new MapboxGL.Popup({ className: "my-class" })
        .setLngLat(lngLat)
        .setDOMContent(popupContainer)
        .addTo(this.mapboxed);
      return { popup, popupContainer };
    });
    this.setState({ popups: popElements });
  }

  removePopups(popups) {
    popups.forEach(({ popup, popupContainer }) => {
      popup.remove();
      ReactDOM.unmountComponentAtNode(popupContainer);
    });
  }

  componentDidMount() {
    MapboxGL.accessToken = accessToken;

    this.mapboxed = new MapboxGL.Map({
      container: "mapbox-gl-element",
      style: mapboxStyles,
      center: [-121.06, 48.35],
      zoom: 8.64205157956079,
      maxZoom: 14
    });

    this.mapEvents();
    this.mapboxed.addControl(new MapboxGL.NavigationControl());
  }

  componentDidUpdate(prevProps) {
    if (!is(fromJS(prevProps.sources), fromJS(this.props.sources))) {
      this.updateSources(this.props.sources);
    }

    if (
      !is(fromJS(prevProps.featureStates), fromJS(this.props.featureStates))
    ) {
      this.updateFeatureStates(
        this.props.featureStates,
        prevProps.featureStates
      );
    }

    if (this.props.flyTo && prevProps.flyTo !== this.props.flyTo) {
      this.mapboxed.flyTo(this.props.flyTo);
    }

    if (!is(fromJS(prevProps.popups), fromJS(this.props.popups))) {
      if (this.state.popups.length) this.removePopups(this.state.popups);
      if (this.props.popups.length) this.addPopups(this.props.popups);
    }

    this.mapboxed.getCanvas().style.cursor = this.props.pointer
      ? "pointer"
      : "";
  }

  mapEvents() {
    WATCH_EVENTS.forEach(eventName => {
      if (!this.props[eventName]) return;

      this.mapboxed.on(
        eventName,
        debounce(
          event => {
            const eventMod = Object.assign({}, event, {
              features: event.point
                ? this.mapboxed.queryRenderedFeatures(event.point, {
                  layers: this.props.watchLayers
                })
                : null
            });
            this.props[eventName](eventMod);
          },
          2,
          { leading: true }
        )
      );
    });
  }

  render() {
    return <Body id="mapbox-gl-element" />;
  }
}

MapBox.propTypes = {
  sources: PropTypes.array,
  featureStates: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      source: PropTypes.string,
      sourceLayer: PropTypes.string
    })
  ),
  popups: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.element,
      lngLat: PropTypes.object //this is the mapbox standard lgnLat object type
    })
  ),
  flyTo: PropTypes.object,
  pointer: PropTypes.bool,
  watchLayers: PropTypes.array
};

const Body = styled("div")`
  width: 100%;
  height: 100%;
`;
