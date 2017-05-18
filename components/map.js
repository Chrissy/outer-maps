import React, { Proptypes } from 'react';
import pointOnLine from '@turf/point-on-line';
import nearest from '@turf/nearest';
import {point, featureCollection} from '@turf/helpers';
import {pointToPoint, pointsToFeatureCollection, trailsToFeatureCollection} from '../modules/stateToGeoJson'
import TooltipContainer from './tooltipContainer';
import MapBox from './mapBox';
import MapSidebarContainer from './mapSidebarContainer';
import {mapBoxLayers} from '../modules/mapBoxLayers';

const WATCH_LAYERS = ['trails', 'national-park-labels', 'national-park-labels-active', 'handles'];

export default class Map extends React.Component {

  onMapMouseMove(event) {
    const feature = event.features[0];

    if (!feature && !this.draggingPoint) {
      event.target.dragPan.enable();
      if (this.props.previewTrail && this.props.previewTrail.id) return this.props.onFeatureMouseOut();
      if (this.props.previewBoundary && this.props.previewBoundary.id) return this.props.onFeatureMouseOut();
    } else {
      if (this.draggingPoint || feature.layer.id == 'handles') {
        this.handleDrag(event);
      } else if (feature.layer.id == 'trails' || feature.layer.id == 'national-park-labels' || feature.layer.id == 'national-park-labels-active') {
        event.target.dragPan.enable();
        this.handleFeature(feature);
      }
    }
  }

  handleFeature(feature) {
    if (this.props.previewBoundary && feature.properties.id == this.props.previewBoundary.id) return;
    if (this.props.previewTrail && feature.properties.id == this.props.previewTrail.id) return;
    this.props.onFeatureMouseIn({properties: feature.properties, geometry: feature.geometry}, feature.layer.id);
  }

  handleDrag(event) {
    event.target.dragPan.disable();

    if (!this.draggingPoint) return;

    let snapToPoint = pointOnLine(this.draggingPoint.trail.geometry, point([event.lngLat.lng, event.lngLat.lat]));
    this.props.updateHandle(this.draggingPoint.properties.id, snapToPoint.geometry.coordinates);
    this.draggingPoint.currentPointOnLine = snapToPoint;
  }

  onMapClick(event) {
    if (this.draggingPoint) return;
    if (!event.features.length) return this.props.onNonFeatureClick();

    const feature = event.features[0];
    const type = event.features[0].layer.id;

    if (type == "trails") {
      this.props.onTrailClick({properties: feature.properties, geometry:feature.geometry});
    } else if (type == "national-park-labels" || type == "national-park-labels-active") {
      this.setState({
        fitToFilter: {
          layers: ['national-parks'],
          filter: ["==", "id", feature.properties.id]
        }
      });
      this.props.onBoundaryClick(feature.properties.id);
    }
  }

  onMapMouseDown(event) {
    const firstHandle = event.features.find(f => f.layer.id == "handles");
    if (!firstHandle) return;
    this.draggingPoint = {...firstHandle,
      trail: this.props.selectedTrails.find(t => t.id == firstHandle.properties.trailId),
      geometry: firstHandle.geometry
    };
  }

  onMapMouseUp(event) {
    if (!this.draggingPoint) return;
    const features = pointsToFeatureCollection(this.draggingPoint.trail.points);
    let snapToPoint = nearest(this.draggingPoint.currentPointOnLine, features);
    this.props.updateHandle(this.draggingPoint.properties.id, snapToPoint.properties.coordinates);
    this.props.setHandleIndex(this.draggingPoint.properties.id, snapToPoint.properties.index);
    this.draggingPoint = null;
    event.target.dragPan.enable();
  }

  sources() {
    let sources = [];

    if (this.props.selectedTrails.length) {
      sources.push({id: 'trails-selected', data: trailsToFeatureCollection(this.props.selectedTrails)})
    }

    if (this.props.handles && this.props.handles.length) {
      sources.push({ id: 'handles', data: featureCollection(this.props.handles.map(p => pointToPoint(p)))});
    }

    return sources;
  }

  filters() {
    console.log(["in", "id", (this.props.selectedBoundary) ? this.props.selectedBoundary.id : 0])
    return [
      {id: "trails-preview", filter: ["in", "id", (this.props.previewTrail) ? this.props.previewTrail.id : 0]},
      {id: "national-park-labels-active", filter: ["in", "id", (this.props.previewBoundary) ? this.props.previewBoundary.id : 0]},
      {id: "national-parks-active", filter: ["in", "id", (this.props.selectedBoundary) ? this.props.selectedBoundary.id : 0]}
    ];
  }

  constructor(props) {
    super(props);

    this.state = {selectedElement: null};
  }

  render() {
    return (
        <div id="the-map">
          <MapBox
          layers={mapBoxLayers}
          sources={this.sources()}
          filters={this.filters()}
          fitToFilter={this.state.fitToFilter}
          pointer={this.props.previewTrail || this.props.previewBoundary}
          watchLayers={WATCH_LAYERS}
          click={this.onMapClick.bind(this)}
          mousemove={this.onMapMouseMove.bind(this)}
          mouseup={this.onMapMouseUp.bind(this)}
          mousedown={this.onMapMouseDown.bind(this)}
          />
          <MapSidebarContainer/>
        </div>
    );
  }
}
