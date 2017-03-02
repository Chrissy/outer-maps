import React, { Proptypes } from 'react';
import TooltipContainer from './tooltipContainer';
import MapBox from './mapBox';
import MapSidebarContainer from './mapSidebarContainer';
import {mapBoxLayers} from '../modules/mapBoxLayers';

export default class Map extends React.Component {

  onMapMouseMove(event) {
    if (event.features.length) {
      this.props.onFeatureMouseIn(event.features[0].properties.id, event.features[0].layer.id);
    } else if (this.props.previewTrails.length || this.props.previewBoundary.length) {
      this.props.onFeatureMouseOut();
    }
  }

  onMapClick(event) {
    if (event.features.length) {
      this.props.onFeatureClick(event.features[0].properties.id, event.features[0].layer.id);
    } else if (this.props.selectedTrails.length || this.props.selectedBoundary.length){
      this.props.onNonFeatureClick();
    }
  }

  onMapDrag(event) {
    this.props.updateView(event.bounds, event.zoom);
  }

  onMapLoad(event) {
    this.props.addSource({
      id: 'trails-data',
      endpoint: '',
      minZoom: 9,
      viewBox: event.bounds,
      zoom: event.zoom
    });
    this.props.addSource({
      id: 'boundaries-data',
      endpoint: '/boundaries',
      maxZoom: 9,
      viewBox: event.bounds,
      zoom: event.zoom
    });
  }

  activeTrailIds() {
    return [...this.props.previewTrails, ...this.props.selectedTrails].map(t => t.id);
  }

  activeBoundaryIds() {
    return [...this.props.previewBoundary, ...this.props.selectedBoundary].map(t => t.id);
  }

  render() {
    return (
        <div id="the-map">
          <MapBox
          activeTrailIDs={this.activeTrailIds()}
          activeBoundaryIds={this.activeBoundaryIds()}
          sources={this.props.sources.filter(s => s.showing)}
          layers={mapBoxLayers}
          pointer={this.props.previewTrails.length > 0}
          onClick={this.onMapClick.bind(this)}
          onLoad={this.onMapLoad.bind(this)}
          onMouseMove={this.onMapMouseMove.bind(this)}
          onDrag={this.onMapDrag.bind(this)}/>
          <TooltipContainer/>
          <MapSidebarContainer/>
        </div>
    );
  }
}
