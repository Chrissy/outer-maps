import React from "react";
import PropTypes from "prop-types";
import pointOnLine from "@turf/point-on-line";
import nearest from "@turf/nearest";
import { point, featureCollection } from "@turf/helpers";
import {
  pointToPoint,
  pointsToFeatureCollection,
  trailsToFeatureCollection
} from "../modules/stateToGeoJson";
import MapBox from "./mapBox";
import styles from "../styles/map.css";
import getOffsetCenter from "../modules/getOffsetCenter";
import sliceElevationsWithHandles from "../modules/sliceElevationsWithHandles";

const WATCH_LAYERS = ["trails", "national-park-labels", "handles"];

export default class Map extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      previewElementLayer: null,
      previewElementId: null,
      flyTo: null
    };

    this.map = React.createRef();
  }

  selectedTrails() {
    return this.props.trails.filter(t => t.selected && t.hasElevationData);
  }

  selectedBoundary() {
    return this.props.boundaries.find(boundary => boundary.selected);
  }

  elementIsSelected() {
    return !!(this.selectedBoundary() || this.selectedTrails().length);
  }

  onMapMouseMove({ target, features: [feature], lngLat }) {
    const { draggingPoint } = this;

    if (!feature && !draggingPoint) {
      target.dragPan.enable();
      return this.setState({
        previewElementId: null,
        previewElementLayer: null
      });
    } else {
      if (draggingPoint || feature.layer.id == "handles") {
        this.handleDrag({ target, lngLat });
      } else if (
        feature.layer.id == "trails" ||
        feature.layer.id == "national-park-labels"
      ) {
        target.dragPan.enable();
        this.handleFeature(feature);
      }
    }
  }

  handleFeature({ properties, layer }) {
    const { previewElementId, previewElementLayer } = this.state;
    if (
      previewElementId &&
      previewElementLayer &&
      previewElementId == properties.id &&
      previewElementLayer == layer["source-layer"]
    )
      return;
    this.setState({
      previewElementId: properties.id,
      previewElementLayer: layer["source-layer"]
    });
  }

  handleDrag({ target, lngLat }) {
    const { draggingPoint, props } = this;

    target.dragPan.disable();

    if (!draggingPoint) return;

    let snapToPoint = pointOnLine(
      draggingPoint.trail.geometry,
      point([lngLat.lng, lngLat.lat])
    );
    props.updateHandle(
      draggingPoint.properties.id,
      snapToPoint.geometry.coordinates
    );
    draggingPoint.currentPointOnLine = snapToPoint;
  }

  onMapClick({ features }) {
    const feature = features[0] || null;
    const { draggingPoint, props } = this;

    if (draggingPoint) return;
    if (!feature && this.elementIsSelected()) return props.onNonFeatureClick();
    if (!feature) return;

    const type = feature.layer.id;

    if (type == "trails") {
      props.onTrailClick({
        properties: feature.properties,
        geometry: feature.geometry
      });
    } else if (
      type == "national-park-labels" ||
      type == "national-park-labels-active"
    ) {
      this.sidebarAwareZoom(feature.geometry.coordinates);
      props.onBoundaryClick(feature);
    }
  }

  sidebarAwareZoom(coordinates) {
    const sidebar = this.map.current.nextSibling; //probably wanna do something better here one day
    this.setState({
      flyTo: {
        center: getOffsetCenter({
          center: coordinates,
          zoom: 10,
          offsetX: window.innerWidth < 600 ? 0 : sidebar.offsetWidth * 0.5,
          offsetY: window.innerWidth > 600 ? 0 : sidebar.offsetHeight * 0.5,
          width: this.map.current.clientWidth,
          height: this.map.current.clientHeight
        }),
        zoom: 10
      }
    });
  }

  onMapMouseDown({ features }) {
    const handle = features.find(f => f.layer.id == "handles");
    if (!handle) return;
    this.draggingPoint = {
      ...handle,
      trail: this.selectedTrails().find(t => t.id == handle.properties.trailId),
      geometry: handle.geometry,
      currentPointOnLine: handle.geometry.coordinates
    };
  }

  onMapMouseUp({ target }) {
    if (!this.draggingPoint) return;
    const {
      draggingPoint,
      draggingPoint: { currentPointOnLine, trail },
      props
    } = this;
    const collection = pointsToFeatureCollection(trail.points);
    const snapToPoint = nearest(currentPointOnLine, collection);

    props.updateHandle(
      draggingPoint.properties.id,
      snapToPoint.properties.coordinates
    );
    props.setHandleIndex(
      draggingPoint.properties.id,
      snapToPoint.properties.index
    );

    this.draggingPoint = null;
    target.dragPan.enable();
  }

  sources() {
    return [
      {
        id: "trails-selected",
        data: trailsToFeatureCollection(
          this.selectedTrails().map(t =>
            sliceElevationsWithHandles(t, this.props.handles)
          )
        )
      },
      {
        id: "handles",
        data: featureCollection(this.props.handles.map(p => pointToPoint(p)))
      }
    ];
  }

  featureStates() {
    let featureStates = [];
    if (this.state.previewElementId && this.state.previewElementLayer)
      featureStates.push({
        source: "local",
        sourceLayer: this.state.previewElementLayer,
        id: this.state.previewElementId,
        state: { preview: true }
      });

    if (this.selectedBoundary())
      featureStates.push({
        source: "local",
        sourceLayer: "national-parks",
        id: this.selectedBoundary().id,
        state: { preview: true }
      });
    return featureStates;
  }

  render() {
    return (
      <div ref={this.map} id="the-map" className={styles.body}>
        <MapBox
          sources={this.sources()}
          featureStates={this.featureStates()}
          flyTo={this.state.flyTo}
          pointer={!!(this.state.previewTrail || this.state.previewBoundary)}
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
