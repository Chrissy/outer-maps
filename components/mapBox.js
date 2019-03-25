import React from "react";
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
      initialized: false
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
    if (oldFeatureStates)
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

  componentDidMount() {
    MapboxGL.accessToken = accessToken;

    const { initialViewport } = this.props;

    this.mapboxed = new MapboxGL.Map({
      container: "mapbox-gl-element",
      style: mapboxStyles,
      center: initialViewport ? initialViewport.center : [-121.06, 48.35],
      zoom: initialViewport ? initialViewport.zoom : 8.64205157956079,
      maxZoom: 14
    });

    this.mapEvents();
    this.mapboxed.addControl(new MapboxGL.NavigationControl());
    this.mapboxed.on("load", () => {
      if (this.props.flyTo) this.mapboxed.flyTo(this.props.flyTo);
      this.setState({ initialized: true });
      this.updateSources(this.props.sources);
      this.updateFeatureStates(this.props.featureStates);
      if (this.props.flyTo) this.mapboxed.flyTo(this.props.flyTo);
    });
  }

  componentDidUpdate(prevProps) {
    if (!this.state.initialized) return;

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

    if (
      this.props.flyTo &&
      !is(fromJS(this.props.flyTo), fromJS(prevProps.flyTo))
    )
      this.mapboxed.flyTo(this.props.flyTo);

    this.mapboxed.getCanvas().style.cursor = this.props.pointer
      ? "pointer"
      : "";
  }

  createEventParams(event) {
    const features = event.point
      ? this.mapboxed.queryRenderedFeatures(event.point, {
        layers: this.props.watchLayers
      })
      : null;

    return Object.assign({}, event, {
      features
    });
  }

  mapEvents() {
    WATCH_EVENTS.forEach(eventName => {
      if (!this.props[eventName]) return;

      this.mapboxed.on(
        eventName,
        debounce(
          event => this.props[eventName](this.createEventParams(event)),
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
  flyTo: PropTypes.object,
  pointer: PropTypes.bool,
  watchLayers: PropTypes.array,
  initialViewport: PropTypes.shape({
    center: PropTypes.array,
    zoom: PropTypes.number
  })
};

const Body = styled("div")`
  width: 100%;
  height: 100%;
`;
