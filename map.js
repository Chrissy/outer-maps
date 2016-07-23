import React, { Proptypes } from 'react';
import MapboxGL from 'mapbox-gl';
import _ from 'underscore';
import TooltipContainer from './tooltipContainer';
import {trailsLayerStatic, trailsLayerActive} from './mapboxStaticData';

MapboxGL.accessToken = 'pk.eyJ1IjoiZml2ZWZvdXJ0aHMiLCJhIjoiY2lvMXM5MG45MWFhenUybTNkYzB1bzJ0MiJ9._5Rx_YN9mGwR8dwEB9D2mg'

export default class Map extends React.Component {

  static watchEvents = {
    'onMapLoad': 'load',
    'onMapMoveEnd': 'moveend',
    'onMapMouseMove': 'mousemove'
  }

  constructor() {
    super()
  }

  loadTrailsWithinBox() {

    var bounds = this.mapboxed.getBounds();

    this.mapboxed.addSource('trails-data', {
      'type': 'geojson',
      'data': `/api/${bounds._sw.lng}/${bounds._sw.lat}/${bounds._ne.lng}/${bounds._ne.lat}`
    })

    this.mapboxed.addLayer(trailsLayerStatic).addLayer(trailsLayerActive)
  }

  removeTrails() {
    this.mapboxed.removeSource('trails-data');
    this.mapboxed.removeLayer('trails');
    this.mapboxed.removeLayer('trails-active');
  }

  onMapLoad() {
    this.loadTrailsWithinBox();
  }

  onMapMoveEnd() {
    this.removeTrails();
    this.loadTrailsWithinBox();
  }

  onMapMouseMove(event) {
    var features = this.mapboxed.queryRenderedFeatures(event.point, { layers: ['trails'] });

    if (features.length) {
      var flatArray = _.flatten(["in", "id", features[0].properties.id, this.state.clickedTrailIds])
      this.mapboxed.setFilter("trails-active", flatArray)
      this.setState({
        hoveredTrailName: features[0].properties.name,
        hoveredTrailSource: features[0].properties.source,
        mouseX: event.point.x,
        mouseY: event.point.y,
        showTooltip: true
      });
    } else {
      this.mapboxed.setFilter("trails-active", _.flatten(["in", "id", this.state.clickedTrailIds]));
      this.setState({showTooltip: false})
    }
  }

  componentDidMount() {
    this.mapboxed = new MapboxGL.Map({
      container: 'mapbox-gl-element',
      style: 'mapbox://styles/mapbox/outdoors-v9',
      center: [-118.6686774, 36.7933829],
      zoom: 10
    });

    this._mapEvents()
  }

  _mapEvents() {
    Object.keys(Map.watchEvents).forEach(function(functionName){
      this.mapboxed.on(Map.watchEvents[functionName], function(event){
        if (this.mapboxed.loaded()) this[functionName](event)
      }.bind(this))
    }.bind(this))
  }

  render() {
    return (
        <div id="the-map">
          <div id="mapbox-gl-element"></div>
          <TooltipContainer/>
        </div>
    );
  }
}
