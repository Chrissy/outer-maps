import React, { Proptypes } from 'react';
import MapboxGL from 'mapbox-gl';
import bbox from '@turf/bbox';
import helpers from '@turf/helpers';
import {accessToken, styleUrl} from '../modules/mapBoxStaticData';

export default class MapBox extends React.PureComponent {

  updateSources(oldSources = [], newSources = []) {
    const changedSources = newSources.filter(s => oldSources.find(os => os.id == s.id && os.data !== s.data));
    const removedSources = oldSources.filter(s => !newSources.map(n => n.id).includes(s.id));
    const addedSources = newSources.filter(s => !oldSources.map(n => n.id).includes(s.id));

    removedSources.forEach(function(source){
      this.mapboxed.removeSource(source.id);
    }.bind(this));

    addedSources.forEach(function(source){
      this.mapboxed.addSource(source.id, {
        data: source.data,
        type: source.type || "geojson",
        tolerance: source.tolerance || 0.3
      });
    }.bind(this));

    changedSources.forEach(function(source){
      this.mapboxed.getSource(source.id).setData(source.data);
    }.bind(this))


    this.updateLayers()
  }

  updateLayers() {
    this.props.layers.forEach(function(layer){
      if (!this.mapboxed.getLayer(layer.id) && this.mapboxed.getSource(layer.source)){
        this.mapboxed.addLayer(layer, layer.before);
      }
      if (this.mapboxed.getLayer(layer.id) && !this.mapboxed.getSource(layer.source)){
        this.mapboxed.removeLayer(layer.id);
      }
    }.bind(this));
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
      style: '/dist/mapbox-styles.json',
      center: [-123.6, 47.8],
      zoom: 8,
      maxZoom: 14
    });

    this.mapEvents();
    this.mapboxed.addControl(new MapboxGL.Navigation());
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
    this.props.watchEvents.forEach((eventName) => {
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
