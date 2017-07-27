import React, { Proptypes } from 'react';
import pointOnLine from '@turf/point-on-line';
import nearest from '@turf/nearest';
import {point, featureCollection} from '@turf/helpers';
import {pointToPoint, pointsToFeatureCollection, trailsToFeatureCollection} from '../modules/stateToGeoJson'
import TooltipContainer from './tooltipContainer';
import MapBox from './mapBox';
import MapSidebarContainer from './mapSidebarContainer';

const WATCH_LAYERS = ['trails', 'national-park-labels', 'national-park-labels-active', 'handles'];

export default class Map extends React.Component {

  onMapMouseMove({features, target, features: [feature], lngLat}) {
    const {draggingPoint, props, props: {previewTrail, previewBoundary}} = this;

    if (!feature && !draggingPoint) {
      target.dragPan.enable();
      if (previewTrail && previewTrail.id) return props.onFeatureMouseOut();
      if (previewBoundary && previewBoundary.id) return props.onFeatureMouseOut();
    } else {
      if (this.draggingPoint || feature.layer.id == 'handles') {
        this.handleDrag({target, lngLat});
      } else if (feature.layer.id == 'trails' || feature.layer.id == 'national-park-labels') {
        target.dragPan.enable();
        this.handleFeature(feature);
      }
    }
  }

  handleFeature({properties, geometry, layer}) {
    const {previewBoundary, previewTrail} = this.props;

    if (previewBoundary && properties.id == previewBoundary.id) return;
    if (previewTrail && properties.id == previewTrail.id) return;
    this.props.onFeatureMouseIn({properties: properties, geometry: geometry}, layer.id);
  }

  handleDrag({target, lngLat}) {
    const {draggingPoint, props} = this;

    target.dragPan.disable();

    if (!this.draggingPoint) return;

    let snapToPoint = pointOnLine(draggingPoint.trail.geometry, point([lngLat.lng, lngLat.lat]));
    props.updateHandle(draggingPoint.properties.id, snapToPoint.geometry.coordinates);
    draggingPoint.currentPointOnLine = snapToPoint;
  }

  onMapClick({features, features: [feature]}) {
    const {draggingPoint, props} = this;

    if (draggingPoint) return;
    if (!features.length) return props.onNonFeatureClick();

    const type = feature.layer.id;

    if (type == "trails") {
      props.onTrailClick({properties: feature.properties, geometry: feature.geometry});
    } else if (type == "national-park-labels" || type == "national-park-labels-active") {
      this.setState({
        fitToFilter: {
          layers: ['national-parks'],
          filter: ["==", "id", feature.properties.id]
        }
      });
      props.onBoundaryClick(feature.properties.id);
    }
  }

  onMapMouseDown({features}) {
    const handle = features.find(f => f.layer.id == "handles");
    if (!handle) return;
    this.draggingPoint = {...handle,
      trail: this.props.selectedTrails.find(t => t.id == handle.properties.trailId),
      geometry: handle.geometry
    };
  }

  onMapMouseUp({target}) {
    if (!this.draggingPoint) return;
    const {draggingPoint, draggingPoint: {currentPointOnLine, trail}, props} = this;
    const snapToPoint = nearest(currentPointOnLine, pointsToFeatureCollection(trail.points));

    props.updateHandle(draggingPoint.properties.id, snapToPoint.properties.coordinates);
    props.setHandleIndex(draggingPoint.properties.id, snapToPoint.properties.index);
    this.draggingPoint = null;
    target.dragPan.enable();
  }

  sources() {
    return [
      { id: 'trails-selected', data: trailsToFeatureCollection(this.props.selectedTrails) },
      { id: 'handles', data: featureCollection(this.props.handles.map(p => pointToPoint(p))) }
    ];
  }

  filters() {
    return [{
      id: "trails-preview",
      filter: ["all",
        ["in", "id", (this.props.previewTrail) ? this.props.previewTrail.id : 0],
        ["!in", "id", ...(this.props.selectedTrails.map(t => t.id) || [] )]
      ]},
      {
        id: "national-parks-active",
        filter: ["in", "id", (this.props.selectedBoundary) ? this.props.selectedBoundary.id : 0]
      },
      {
        id: "national-park-labels-active",
        filter: ["in", "id", (this.props.previewBoundary) ? this.props.previewBoundary.id : 0]
      }
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
