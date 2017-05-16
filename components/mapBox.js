import React, { Proptypes } from 'react';
import MapboxGL from 'mapbox-gl';
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

  handleMouseMove(event) {
    var features = this.mapboxed.queryRenderedFeatures(event.point, { layers: ['trails', 'national-parks', 'handles'] });

    this.props.onMouseMove(Object.assign({}, event, {
      features: features
    }));
  }

  handleMouseDown(event) {
    var features = this.mapboxed.queryRenderedFeatures(event.point, { layers: ['trails', 'national-parks', 'handles'] });

    this.props.onMouseDown(Object.assign({}, event, {
      features: features,
    }));
  }

  handleMouseUp(event) {
    this.props.onMouseUp(event);
  }

  handleClick(event) {
    var features = this.mapboxed.queryRenderedFeatures(event.point, { layers: ['trails', 'national-parks'] });
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
    this.updateSources([], this.props.sources);

    this.props.onLoad(Object.assign({}, event, {
      bounds: this.mapboxed.getBounds().toArray(),
      zoom: this.mapboxed.getZoom()
    }));
  }

  componentDidMount() {
    MapboxGL.accessToken = accessToken;

    this.mapboxed = new MapboxGL.Map({
      container: 'mapbox-gl-element',
      style: '/dist/mapbox-styles.json',
      center: [-123.6, 47.8],
      zoom: 8,
      maxZoom: 14
    })

    this.mapEvents();
    this.mapboxed.addControl(new MapboxGL.Navigation());
  }

  componentDidUpdate(prevProps, q) {
    this.updateSources(prevProps.sources, this.props.sources);

    this.mapboxed.setFilter("trails-preview", ["in", "id", (this.props.previewTrail) ? this.props.previewTrail.id : 0]);

    if (this.props.fitBounds && prevProps.fitBounds !== this.props.fitBounds) {
      this.mapboxed.fitBounds(this.props.fitBounds);
    }

    this.mapboxed.getCanvas().style.cursor = (this.props.pointer) ? 'pointer' : '';
  }

  mapEvents() {
    let watchEvents = {
      'handleLoad': 'load',
      'handleMouseDown': 'mousedown',
      'handleMouseUp': 'mouseup',
      'handleDrag': 'moveend',
      'handleMouseMove': 'mousemove',
      'handleClick': 'click',
    }

    Object.keys(watchEvents).forEach(function(functionName){
      this.mapboxed.on(watchEvents[functionName], function(event){
        this[functionName](event);
      }.bind(this));
    }.bind(this));
  }

  render() {
    return (
      <div id="mapbox-gl-element"></div>
    );
  }
}
