import React, { Proptypes } from 'react';
import MapboxGL from 'mapbox-gl';
import bbox from '@turf/bbox';
import helpers from '@turf/helpers';
import {accessToken, styleUrl} from '../modules/mapBoxStaticData';
const WATCH_EVENTS = ['mousedown','mouseup','click','dblclick','mousemove','mouseenter', 'mouseleave','mouseover','mouseout','contextmenu','touchstart','touchend','touchcancel'];
const req = require.context("../styles", true, /\.json$/);
const base = req("./base.json");
const env = require("../environment/development.js");
const mapboxStyles = Object.assign({}, base, {
  layers: [].concat(...base.layers.map(l => req(`./${l}.json`))).map(l => {
    const source = (env.tileSource == "remote") ? "composite" : "local"
    if (l.source) l.source = (l.source == "$source") ? source : l.source;
    return l;
  }),
  sources: base[env.tileSource]
});

export default class MapBox extends React.PureComponent {

  updateSources(oldSources = [], newSources = []) {
    newSources.forEach(function(source) {
      this.mapboxed.getSource(source.id).setData(source.data);
    }.bind(this))
  }

  updateFilters(filters) {
    filters.forEach(f => {
      this.mapboxed.setFilter(f.id, f.filter);
    });
  }

  fitToFilter(filterObj) {
    const elements = this.mapboxed.queryRenderedFeatures(filterObj);
    if (!elements.length) return;
    const combinedFeatures = helpers.featureCollection(elements);
    this.mapboxed.fitBounds(bbox(combinedFeatures));
  }

  componentDidMount() {
    MapboxGL.accessToken = accessToken;

    this.mapboxed = new MapboxGL.Map({
      container: 'mapbox-gl-element',
      style: mapboxStyles,
      center: [-123.6, 47.8],
      zoom: 8,
      maxZoom: 14
    });

    this.mapEvents();
    this.mapboxed.addControl(new MapboxGL.NavigationControl());
  }

  componentDidUpdate(prevProps, q) {
    this.updateSources(prevProps.sources, this.props.sources);

    if (this.props.filters && prevProps.filters !== this.props.filters) {
      this.updateFilters(this.props.filters);
    }

    if (this.props.fitToFilter && prevProps.fitToFilter !== this.props.fitToFilter) {
      this.fitToFilter(this.props.fitToFilter)
    }

    this.mapboxed.getCanvas().style.cursor = (this.props.pointer) ? 'pointer' : '';
  }

  mapEvents() {
    WATCH_EVENTS.forEach((eventName) => {
      if (!this.props[eventName]) return;
      this.mapboxed.on(eventName, (event) => {
        this.props[eventName](Object.assign({}, event, {
          bounds: this.mapboxed.getBounds().toArray(),
          zoom: this.mapboxed.getZoom(),
          features: (event.point) ? this.mapboxed.queryRenderedFeatures(event.point, { layers: this.props.watchLayers }) : null
        }));
      });
    });
  }

  render() {
    return (
      <div id="mapbox-gl-element"></div>
    );
  }
}
