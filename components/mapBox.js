import React, { Proptypes } from 'react';
import MapboxGL from 'mapbox-gl';
import {accessToken, styleUrl} from '../modules/mapBoxStaticData';

export default class MapBox extends React.PureComponent {

  updateSources(oldSources = [], newSources = []) {
    const changedSources = newSources.filter(s => oldSources.find(os => os.id == s.id && os.data !== s.data));
    const removedSources = oldSources.filter(s => !newSources.map(n => n.id).includes(s.id));
    const addedSources = newSources.filter(s => !oldSources.map(n => n.id).includes(s.id));

    changedSources.concat(removedSources).forEach(function(source){
      this.mapboxed.removeSource(source.id);
    }.bind(this));

    changedSources.concat(addedSources).forEach(function(source){
      this.mapboxed.addSource(source.id, {
        data: source.data,
        type: "geojson"
      });
    }.bind(this));


    this.updateLayers()
  }

  updateLayers() {
    this.props.layers.forEach(function(layer){
      if (!this.mapboxed.getLayer(layer.id) && this.mapboxed.getSource(layer.source)){
        this.mapboxed.addLayer(layer);
      }
      if (this.mapboxed.getLayer(layer.id) && !this.mapboxed.getSource(layer.source)){
        this.mapboxed.removeLayer(layer.id);
      }
    }.bind(this));
  }

  handleMouseMove(event) {
    var features = this.mapboxed.queryRenderedFeatures(event.point, { layers: ['trails', 'boundaries'] });

    this.props.onMouseMove(Object.assign({}, event, {
      features: features,
    }));
  }

  handleClick(event) {
    var features = this.mapboxed.queryRenderedFeatures(event.point, { layers: ['trails', 'boundaries'] });
    this.props.onClick(Object.assign({}, event, {
      features: features,
    }));
  }

  handleDrag(event) {
    this.props.onDrag(Object.assign({}, event, {
      bounds: this.mapboxed.getBounds().toArray(),
      zoom: this.mapboxed.getZoom()
    }));
  }

  handleZoom(event) {
    this.props.onDrag(Object.assign({}, event, {
      bounds: this.mapboxed.getBounds().toArray(),
      zoom: this.mapboxed.getZoom()
    }));
  }

  handleLoad(event) {
    this.props.onLoad(Object.assign({}, event, {
      bounds: this.mapboxed.getBounds().toArray(),
      zoom: this.mapboxed.getZoom()
    }));
  }

  componentDidMount() {
    MapboxGL.accessToken = accessToken;

    this.mapboxed = new MapboxGL.Map({
      container: 'mapbox-gl-element',
      style: styleUrl,
      center: [-113.0, 37.3],
      zoom: 11
    });

    this.mapEvents();
    this.mapboxed.addControl(new MapboxGL.Navigation());
  }

  componentDidUpdate(prevProps, q) {
    this.updateSources(prevProps.sources, this.props.sources);

    if (this.mapboxed.getSource('trails-data') && this.mapboxed.getLayer('trails-active')) {
      this.mapboxed.setFilter("trails-active", ["in", "id", ...this.props.activeTrailIDs.map(t => parseInt(t))]);
    }

    if (this.mapboxed.getSource('boundaries-data') && this.mapboxed.getLayer('boundaries-active')) {
      this.mapboxed.setFilter("boundaries-active", ["in", "id", ...this.props.activeBoundaryIds.map(t => parseInt(t))]);
      this.mapboxed.setFilter("boundaries-active-outline", ["in", "id", ...this.props.activeBoundaryIds.map(t => parseInt(t))]);
    }

    if (prevProps.fitBounds !== this.props.fitBounds) {
      this.mapboxed.fitBounds([this.props.fitBounds[0], this.props.fitBounds[1]]);
    }

    this.mapboxed.getCanvas().style.cursor = (this.props.pointer) ? 'pointer' : '';
  }

  mapEvents() {
    let watchEvents = {
      'handleLoad': 'load',
      'handleDrag': 'moveend',
      'handleMouseMove': 'mousemove',
      'handleClick': 'click',
    }

    Object.keys(watchEvents).forEach(function(functionName){
      this.mapboxed.on(watchEvents[functionName], function(event){
        this[functionName](event);
      }.bind(this))
    }.bind(this))
  }

  render() {
    return (
      <div id="mapbox-gl-element"></div>
    );
  }
}
