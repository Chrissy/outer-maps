import React, { Proptypes } from 'react';
import pointOnLine from '@turf/point-on-line';
import nearest from '@turf/nearest';
import {point, featureCollection} from '@turf/helpers';
import {pointToPoint, pointsToFeatureCollection, trailsToFeatureCollection} from '../modules/stateToGeoJson'
import TooltipContainer from './tooltipContainer';
import MapBox from './mapBox';
import MapSidebarContainer from './mapSidebarContainer';
import {mapBoxLayers} from '../modules/mapBoxLayers';

const TRAILS_BREAKPOINT = 9;
const SMALL_LABELS_BREAKPOINT = 10;
const LARGE_LABELS_BREAKPOINT = 12;

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
      } else if (feature.layer.id == 'trails' || feature.layer.id == 'boundaries') {
        event.target.dragPan.enable();
        this.handleFeature(feature);
      }
    }
  }

  handleFeature(feature) {
    if (this.props.previewBoundary && feature.properties.id == this.props.previewBoundary.id) return;
    if (this.props.previewTrail && feature.properties.id == this.props.previewTrail.id) return;
    console.log(feature.properties)
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
    } else if (type == "boundaries") {
      this.props.onBoundaryClick(feature.properties.id);
    }
  }

  onMapDrag(event) {
    this.setState({viewBox: event.bounds, zoom: event.zoom})
  }

  onMapLoad(event) {
    this.setState({viewBox: event.bounds, zoom: event.zoom})
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

  fitBounds() {
    if (this.props.selectedBoundary) return this.props.selectedBoundary.bounds;
  }

  sources() {
    if (!this.state.zoom || !this.state.viewBox) return [];
    let sources = [];
    let viewBox = this.state.viewBox;
    let zoom = this.state.zoom;

    if (this.state.zoom >= TRAILS_BREAKPOINT) {
      sources.push({id: 'trails', data: `api/trails/${viewBox[0][0]}/${viewBox[0][1]}/${viewBox[1][0]}/${viewBox[1][1]}`});
      sources.push({id: 'trails-active', data: trailsToFeatureCollection(this.props.activeTrails)});
    }
    if (this.state.zoom < TRAILS_BREAKPOINT) {
      sources.push({id: 'boundaries', data: `api/boundaries/${viewBox[0][0]}/${viewBox[0][1]}/${viewBox[1][0]}/${viewBox[1][1]}`});
      sources.push({id: 'boundaries-active', data: featureCollection(this.props.activeBoundaries)});
    }
    if (this.state.zoom > SMALL_LABELS_BREAKPOINT && this.state.zoom < LARGE_LABELS_BREAKPOINT) {
      sources.push({id: 'trails-for-labels-high-zoom', data: `api/trail-paths-for-labels/${viewBox[0][0]}/${viewBox[0][1]}/${viewBox[1][0]}/${viewBox[1][1]}`});
    }
    if (this.state.zoom > LARGE_LABELS_BREAKPOINT) {
      sources.push({id: 'trails-for-labels', data: `api/trail-paths-for-labels/${viewBox[0][0]}/${viewBox[0][1]}/${viewBox[1][0]}/${viewBox[1][1]}`});
    }

    if (this.props.handles && this.props.handles.length) {
      sources.push({
        id: 'handles',
        data: featureCollection(this.props.handles.map(p => pointToPoint(p)))
      });
    }

    return sources;
  }

  constructor(props) {
    super(props);

    this.state = {zoom: null, viewBox: null};
  }

  render() {
    return (
        <div id="the-map">
          <MapBox
          sources={this.sources()}
          layers={mapBoxLayers}
          fitBounds={this.fitBounds()}
          pointer={this.props.previewTrail}
          onClick={this.onMapClick.bind(this)}
          onLoad={this.onMapLoad.bind(this)}
          onMouseMove={this.onMapMouseMove.bind(this)}
          onMouseUp={this.onMapMouseUp.bind(this)}
          onMouseDown={this.onMapMouseDown.bind(this)}
          onDrag={this.onMapDrag.bind(this)}/>
          <MapSidebarContainer/>
        </div>
    );
  }
}
