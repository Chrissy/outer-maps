import React, { Proptypes } from 'react';
import MapboxGL from 'mapbox-gl';
import {trailsLayerStatic, trailsLayerActive, accessToken} from './mapboxStaticData';

export default class MapBox extends React.Component {

  clearMap() {
    this.mapboxed.removeSource('trails-data');
    this.mapboxed.removeLayer('trails');
    this.mapboxed.removeLayer('trails-active');
  }

  drawMap() {
    let bounds = this.mapboxed.getBounds();

    this.mapboxed.addSource('trails-data', {
      'type': 'geojson',
      'data': `/api/${bounds._sw.lng}/${bounds._sw.lat}/${bounds._ne.lng}/${bounds._ne.lat}`
    });

    this.mapboxed.addLayer(trailsLayerStatic).addLayer(trailsLayerActive);
  }

  handleMouseMove(event) {
    var features = this.mapboxed.queryRenderedFeatures(event.point, { layers: ['trails'] });

    this.props.onMouseMove(Object.assign({}, event, {
      features: features,
      bounds: this.mapboxed.getBounds()
    }));
  }

  handleClick(event) {
    var features = this.mapboxed.queryRenderedFeatures(event.point, { layers: ['trails'] });
    this.props.onClick(Object.assign({}, event, {
      features: features,
      bounds: this.mapboxed.getBounds()
    }));
  }

  handleDrag(event) {
    this.props.onDrag(Object.assign({}, event, {
      bounds: this.mapboxed.getBounds()
    }));

    this.clearMap();
    this.drawMap();
  }

  handleLoad(event) {
    this.props.onLoad(Object.assign({}, event, {
      bounds: this.mapboxed.getBounds()
    }));

    this.drawMap();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.activeTrailIDs) {
      this.mapboxed.setFilter("trails-active", ["in", "id", ...this.props.activeTrailIDs]);
    }
  }

  componentDidMount() {
    MapboxGL.accessToken = accessToken;

    this.mapboxed = new MapboxGL.Map({
      container: 'mapbox-gl-element',
      style: 'mapbox://styles/mapbox/outdoors-v9',
      center: [-118.6686774, 36.7933829],
      zoom: 10
    });

    this.mapEvents()
  }

  mapEvents() {
    let watchEvents = {
      'handleLoad': 'load',
      'handleDrag': 'moveend',
      'handleMouseMove': 'mousemove',
      'handleClick': 'click'
    }

    Object.keys(watchEvents).forEach(function(functionName){
      this.mapboxed.on(watchEvents[functionName], function(event){
        if (this.mapboxed.loaded()) this[functionName](event)
      }.bind(this))
    }.bind(this))
  }

  render() {
    return (
      <div id="mapbox-gl-element"></div>
    );
  }
}
