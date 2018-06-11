import React from "react";
import PropTypes from "prop-types";
import pointOnLine from "@turf/point-on-line";
import nearest from "@turf/nearest";
import bbox from "@turf/bbox";
import {point, featureCollection} from "@turf/helpers";
import {pointToPoint, pointsToFeatureCollection, trailsToFeatureCollection} from "../modules/stateToGeoJson";
import TooltipContainer from "./tooltipContainer";
import MapBox from "./mapBox";
import styles from "../styles/map.css";
import getOffsetCenter from "../modules/getOffsetCenter";
import sliceElevationsWithHandles from "../modules/sliceElevationsWithHandles";

const WATCH_LAYERS = ["trails", "national-park-labels", "national-park-labels-active", "handles"];

export default class Map extends React.Component {

  selectedTrails() {
    return this.props.trails.filter(t => t.selected && t.hasElevationData);
  }

  selectedBoundary() {
    return this.props.boundaries.find(boundary => boundary.selected);
  }

  elementIsSelected() {
    return !!(this.selectedBoundary() || this.selectedTrails().length);
  }

  onMapMouseMove({features, target, features: [feature], lngLat}) {
    const {draggingPoint, props, state: {previewTrailId, previewBoundaryId}} = this;

    if (!feature && !draggingPoint) {
      target.dragPan.enable();
      if (previewTrailId) return this.setState({previewTrailId: 0});
      if (previewBoundaryId) return this.setState({previewBoundaryId: 0});
    } else {
      if (draggingPoint || feature.layer.id == "handles") {
        this.handleDrag({target, lngLat});
      } else if (feature.layer.id == "trails" || feature.layer.id == "national-park-labels") {
        target.dragPan.enable();
        this.handleFeature(feature);
      }
    }
  }

  handleFeature({properties, geometry, layer}) {
    const {previewBoundaryId, previewTrailId} = this.state;
    if (previewBoundaryId && properties.id == previewBoundaryId) return;
    if (previewTrailId && properties.id == previewTrailId) return;
    if (layer.id == "trails") this.setState({previewTrailId: properties.id, previewBoundaryId: 0});
    if (layer.id == "national-park-labels") this.setState({previewBoundaryId: properties.id, previewTrailId: 0});
  }

  handleDrag({target, lngLat}) {
    const {draggingPoint, props} = this;

    target.dragPan.disable();

    if (!draggingPoint) return;

    let snapToPoint = pointOnLine(draggingPoint.trail.geometry, point([lngLat.lng, lngLat.lat]));
    props.updateHandle(draggingPoint.properties.id, snapToPoint.geometry.coordinates);
    draggingPoint.currentPointOnLine = snapToPoint;
  }

  onMapClick({point, features, features: [feature]}) {
    const {draggingPoint, props} = this;

    if (draggingPoint) return;
    if (!feature && this.elementIsSelected()) return props.onNonFeatureClick();
    if (!feature) return;

    const type = feature.layer.id;

    if (type == "trails") {
      props.onTrailClick({properties: feature.properties, geometry: feature.geometry});
    } else if (type == "national-park-labels" || type == "national-park-labels-active") {
      this.sidebarAwareZoom(feature.geometry.coordinates);
      props.onBoundaryClick(feature);
    }
  }

  sidebarAwareZoom(coordinates) {
    const sidebar = this.refs.map.nextSibling; //probably wanna do something better here one day
    this.setState({flyTo: {
      center: getOffsetCenter({
        center: coordinates,
        zoom: 10,
        offsetX: (window.innerWidth < 600) ? 0 : sidebar.offsetWidth * 0.5,
        offsetY: (window.innerWidth > 600) ? 0 : sidebar.offsetHeight * 0.5,
        width: this.refs.map.clientWidth,
        height: this.refs.map.clientHeight
      }),
      zoom: 10
    }});
  }

  onMapMouseDown({features}) {
    const handle = features.find(f => f.layer.id == "handles");
    if (!handle) return;
    this.draggingPoint = {...handle,
      trail: this.selectedTrails().find(t => t.id == handle.properties.trailId),
      geometry: handle.geometry,
      currentPointOnLine: handle.geometry.coordinates
    };
  }

  onMapMouseUp({target}) {
    if (!this.draggingPoint) return;
    const {draggingPoint, draggingPoint: {currentPointOnLine, trail}, props} = this;
    const collection = pointsToFeatureCollection(trail.points);
    const snapToPoint = nearest(currentPointOnLine, collection);

    props.updateHandle(draggingPoint.properties.id, snapToPoint.properties.coordinates);
    props.setHandleIndex(draggingPoint.properties.id, snapToPoint.properties.index);
    this.draggingPoint = null;
    target.dragPan.enable();
  }

  sources() {
    return [
      {
        id: "trails-selected",
        data: trailsToFeatureCollection(this.selectedTrails().map(t => sliceElevationsWithHandles(t, this.props.handles)))
      },
      {
        id: "handles",
        data: featureCollection(this.props.handles.map(p => pointToPoint(p)))
      }
    ];
  }

  filters() {
    return [{
      id: "trails-preview",
      filter: ["all",
        ["in", "id", this.state.previewTrailId],
        ["!in", "id", ...(this.selectedTrails().map(t => t.id) || [] )]
      ]},
    {
      id: "national-parks-active",
      filter: ["in", "id", (this.selectedBoundary()) ? this.selectedBoundary().id : 0]
    },
    {
      id: "national-park-labels-active",
      filter: ["in", "id", this.state.previewBoundaryId]
    }
    ];
  }

  constructor(props) {
    super(props);

    this.state = {
      previewBoundaryId: 0,
      previewTrailId: 0,
      flyTo: null
    };
  }

  render() {

    return (
      <div ref="map" id="the-map" className={styles.body}>
        <MapBox
          sources={this.sources()}
          filters={this.filters()}
          flyTo={this.state.flyTo}
          pointer={this.state.previewTrailId || this.state.previewBoundaryId}
          watchLayers={WATCH_LAYERS}
          click={this.onMapClick.bind(this)}
          mousemove={this.onMapMouseMove.bind(this)}
          mouseup={this.onMapMouseUp.bind(this)}
          mousedown={this.onMapMouseDown.bind(this)}
        />
      </div>
    );
  }
}

Map.propTypes = {
  trails: PropTypes.array,
  boundaries: PropTypes.array,
  handles: PropTypes.array,
  onTrailClick: PropTypes.func,
  onBoundaryClick: PropTypes.func,
  onNonFeatureClick: PropTypes.func,
  updateHandle: PropTypes.func,
  setHandleIndex: PropTypes.func
};
