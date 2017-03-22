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

    if (this.draggingPoint) {
      this.draggingPoint = Object.assign(this.draggingPoint, {
        coordinates: [event.lngLat.lng, event.lngLat.lat]
      });
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
    if (!event.features.length || !firstHandle) return;
    event.target.dragPan.disable();
    this.draggingPoint = this.handles().find(h => h.id == firstHandle.properties.id && h.firstHandle == firstHandle.properties.firstHandle);
  }

  onMapMouseUp(event) {
    this.draggingPoint = null;
    event.target.dragPan.enable()
  }

  activeTrailIds() {
    return [...this.props.previewTrails, ...this.props.selectedTrails].map(t => t.id);
  }

  activeBoundaryIds() {
    return [this.props.previewBoundary.id, this.props.selectedBoundary.id];
  }

  handles() {
    const firstPoints = this.props.selectedTrails.map(s => s.points[0]);
    const lastPoints = this.props.selectedTrails.map(s => s.points[s.points.length - 1])
    let collectivePoints = firstPoints.concat(lastPoints);
    if (this.draggingPoint) {
      collectivePoints = collectivePoints.filter(p => !(p.id == this.draggingPoint.id)).concat(this.draggingPoint);
    }
    return collectivePoints;
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
          handles={this.handles()}
          onDrag={this.onMapDrag.bind(this)}/>
          <TooltipContainer/>
          <MapSidebarContainer/>
        </div>
    );
  }
}
