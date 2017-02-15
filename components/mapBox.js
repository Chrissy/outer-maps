import React, { Proptypes } from 'react';
import MapboxGL from 'mapbox-gl';
import {accessToken} from '../modules/mapBoxStaticData';
import {boundaryLayers, trailLayers} from '../modules/mapBoxLayers';

export default class MapBox extends React.Component {

  handleMouseMove(event) {
    var features = this.mapboxed.queryRenderedFeatures(event.point, { layers: ['trails'] });

    this.props.onMouseMove(Object.assign({}, event, {
      features: features,
    }));
  }

  handleClick(event) {
    var features = this.mapboxed.queryRenderedFeatures(event.point, { layers: ['trails'] });
    this.props.onClick(Object.assign({}, event, {
      features: features,
    }));
  }

  handleDrag(event) {
    this.props.onDrag(Object.assign({}, event, {
      bounds: this.mapboxed.getBounds()
    }));
  }

  handleZoom(event) {
    this.props.onDrag(Object.assign({}, event, {
      bounds: this.mapboxed.getBounds()
    }));
  }

  handleLoad(event) {
    this.props.onLoad(Object.assign({}, event, {
      bounds: this.mapboxed.getBounds()
    }));
  }

  drawMap(viewBox) {
    console.log(this.mapboxed.getZoom());
    if (this.mapboxed.getZoom() > 9) {
      this.drawTrails(viewBox)
    } else {
      this.drawBoundaries(viewBox);
    }
  }

  clearMap() {
    if (this.mapboxed.getSource('trails-data')) this.clearTrails();
    if (this.mapboxed.getSource('boundaries-data')) this.clearBoundaries();
  }

  drawTrails(viewBox) {
    if (!viewBox) return;

    this.mapboxed.addSource('trails-data', {
      'type': 'geojson',
      'data': `/api/${viewBox.sw1}/${viewBox.sw2}/${viewBox.ne1}/${viewBox.ne2}`
    });

    trailLayers.forEach(layer => this.mapboxed.addLayer(layer));
  }

  clearTrails() {
    this.mapboxed.removeSource('trails-data');

    trailLayers.forEach(function(layer) {
      this.mapboxed.removeLayer(layer.id)
    }.bind(this));
  }

  drawBoundaries(viewBox) {
    if (!viewBox) return;

    this.mapboxed.addSource('boundaries-data', {
      'type': 'geojson',
      'data': `/api/boundaries/${viewBox.sw1}/${viewBox.sw2}/${viewBox.ne1}/${viewBox.ne2}`
    });

    boundaryLayers.forEach(layer => this.mapboxed.addLayer(layer));
  }

  clearBoundaries() {
    this.mapboxed.removeSource('boundaries-data');

    boundaryLayers.forEach(function(layer) {
      this.mapboxed.removeLayer(layer.id)
    }.bind(this));
  }

  componentDidMount() {
    MapboxGL.accessToken = accessToken;

    this.mapboxed = new MapboxGL.Map({
      container: 'mapbox-gl-element',
      style: 'mapbox://styles/mapbox/outdoors-v9',
      center: [-113.0, 37.3],
      zoom: 11
    });

    this.mapEvents();
    this.mapboxed.addControl(new MapboxGL.Navigation());
  }

  componentWillReceiveProps(nextProps) {
    const viewBox = nextProps.viewBox

    if (viewBox !== this.props.viewBox) {
      if (this.props.viewBox) this.clearMap();
      this.drawMap(viewBox);
    }

    if (nextProps.activeTrailIDs !== this.props.activeTrailIDs && this.mapboxed.getSource('trails-data')) {
      this.mapboxed.setFilter("trails-active", ["in", "id", ...nextProps.activeTrailIDs.map(t => parseInt(t))]);
    }
  }

  componentDidUpdate(props) {
    this.mapboxed.getCanvas().style.cursor = (this.props.pointer) ? 'pointer' : '';
  }

  mapEvents() {
    let watchEvents = {
      'handleLoad': 'load',
      'handleDrag': 'moveend',
      'handleMouseMove': 'mousemove',
      'handleClick': 'click',
      'handleZoom': 'zoomend'
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
