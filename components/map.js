import React, { Proptypes } from 'react';
import TooltipContainer from './tooltipContainer';
import MapBox from './mapBox';
import MapSidebarContainer from './mapSidebarContainer';
import {mapBoxLayers} from '../modules/mapBoxLayers';

export default class Map extends React.Component {

  onMapMouseMove(event) {
    if (this.draggingPoint) {
      event.target.dragPan.disable();
      this.props.updateHandle(this.draggingPoint.properties.id, [event.lngLat.lng, event.lngLat.lat]);
    } else {
      if (event.features.length && event.features[0].layer.id !== 'handles') {
        this.props.onFeatureMouseIn(event.features[0].properties.id, event.features[0].layer.id);
      } else if (this.props.previewTrails.length || this.props.previewBoundary.length) {
        this.props.onFeatureMouseOut();
      }
    }

    if (event.features.length && event.features.some(f => f.layer.id == 'handles')) {
      event.target.dragPan.disable();
    } else {
      event.target.dragPan.enable();
    }
  }

  onMapClick(event) {
    if (this.draggingPoint) return;

    if (event.features.length) {
      this.props.onFeatureClick(event.features[0].properties.id, event.features[0].layer.id);
    } else if (this.props.selectedTrails.length || this.props.selectedBoundary.length) {
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

  onMapMouseDown(event) {
    const firstHandle = event.features.find(f => f.layer.id == "handles");
    if (!firstHandle) return;
    this.draggingPoint = firstHandle;
  }

  onMapMouseUp(event) {
    if (this.draggingPoint) this.draggingPoint = null;
  }

  activeTrailIds() {
    return [...this.props.previewTrails, ...this.props.selectedTrails].map(t => t.id);
  }

  activeBoundaryIds() {
    return [this.props.previewBoundary.id, this.props.selectedBoundary.id];
  }

  render() {
    return (
        <div id="the-map">
          <MapBox
          activeTrailIDs={this.activeTrailIds()}
          activeBoundaryIds={this.activeBoundaryIds()}
          sources={this.props.sources.filter(s => s.showing)}
          layers={mapBoxLayers}
          fitBounds={this.props.selectedBoundary.bounds}
          pointer={this.props.previewTrails.length > 0}
          onClick={this.onMapClick.bind(this)}
          onLoad={this.onMapLoad.bind(this)}
          onMouseMove={this.onMapMouseMove.bind(this)}
          onMouseUp={this.onMapMouseUp.bind(this)}
          onMouseDown={this.onMapMouseDown.bind(this)}
          handles={this.props.handles}
          onDrag={this.onMapDrag.bind(this)}/>
          <MapSidebarContainer/>
        </div>
    );
  }
}
