import React from "react";
import PropTypes from "prop-types";
import GeoViewport from "@mapbox/geo-viewport";
import { fromJS, is } from "immutable";
import { parse } from "query-string";
import pointOnLine from "@turf/point-on-line";
import nearest from "@turf/nearest";
import destination from "@turf/destination";
import bearing from "@turf/bearing";
import distance from "@turf/distance";
import lineIntersect from "@turf/line-intersect";
import { point, featureCollection } from "@turf/helpers";
import {
  pointToPoint,
  pointsToFeatureCollection,
  trailsToFeatureCollection
} from "../modules/stateToGeoJson";
import MapBox from "./mapBox";
import TrailControl from "./trailControlContainer";
import sliceElevationsWithHandles from "../modules/sliceElevationsWithHandles";
import styled from "react-emotion";
import theme from "../styles/theme";

const WATCH_LAYERS = [
  "trails-selected",
  "trails",
  "national-park-labels",
  "handles"
];

export default class Map extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      previewElement: null,
      flyTo: null
    };

    this.map = React.createRef();
  }

  selectedTrails() {
    return this.props.trails.filter(t => t.selected && t.hasElevationData);
  }

  elementIsSelected() {
    return !!(this.props.boundary || this.selectedTrails().length);
  }

  activeHandle() {
    if (this.draggingPoint) return this.draggingPoint;
    const activelyCutting = this.props.handles.find(h => h.activelyCutting);

    if (!activelyCutting) return null;

    if (activelyCutting)
      return {
        ...activelyCutting,
        trail: this.selectedTrails().find(t => t.id == activelyCutting.trailId),
        geometry: point(activelyCutting.coordinates),
        currentPointOnLine: activelyCutting.coordinates
      };
  }

  onMapMouseMove({ target, features: [feature], lngLat }) {
    if (!feature && !this.activeHandle()) {
      if (this.state.previewElement) {
        target.dragPan.enable();
        return this.setState({
          previewElement: null
        });
      }
    } else {
      if (this.activeHandle() || feature.layer.id == "handles") {
        this.handleDrag({ target, lngLat });
      } else if (
        feature.layer.id == "trails" ||
        feature.layer.id == "national-park-labels"
      ) {
        target.dragPan.enable();
        this.handleFeatureHover(feature);
      }
    }
  }

  handleFeatureHover({ properties, layer }) {
    const { previewElement } = this.state;

    if (
      previewElement &&
      previewElement.id == properties.id &&
      previewElement.sourceLayer == layer["source-layer"]
    )
      return;

    this.setState({
      previewElement: {
        id: properties.id,
        sourceLayer: layer["source-layer"],
        source: layer.source,
        ...properties
      }
    });
  }

  handleDrag({ target, lngLat }) {
    const { props } = this;

    target.dragPan.disable();

    if (!this.activeHandle()) return;

    let snapToPoint = pointOnLine(
      this.activeHandle().trail.geometry,
      point([lngLat.lng, lngLat.lat])
    );

    props.updateHandle(
      this.activeHandle().id,
      snapToPoint.geometry.coordinates
    );

    if (this.draggingPoint) this.draggingPoint.currentPointOnLine = snapToPoint;
  }

  onMapClick({ features, lngLat }) {
    const feature = features[0] || null;
    const { props } = this;

    if (this.draggingPoint) return;
    if (!feature && this.elementIsSelected()) return props.onNonFeatureClick();
    if (!feature) return;

    const type = feature.layer.id;

    if (type == "trails" || type == "trails-selected") {
      this.setState({
        activeTrailLngLat: lngLat,
        previewElement: null
      });
      props.onTrailClick({
        properties: feature.properties,
        geometry: feature.geometry,
        activeSegment: type == "trails-selected"
      });
    } else if (
      type == "national-park-labels" ||
      type == "national-park-labels-active"
    ) {
      props.onBoundaryClick(feature.properties);
    }
  }

  getSidebarWidth() {
    return Math.min(
      theme.sidebarMaxWidth,
      Math.max(
        theme.sidebarMinWidth,
        window.innerWidth * theme.sidebarPercentageWidth
      )
    );
  }

  getAdjustedViewport(bounds) {
    const sidebarWidth = this.getSidebarWidth();
    const dimensions = [window.innerWidth - sidebarWidth, window.innerHeight];
    const { center, zoom } = GeoViewport.viewport(bounds, dimensions);

    /*
      we measure the length of the viewport to get an adjustment value.
      we have to add one to the zoom, otherwise it gets off.
    */
    const viewBounds = GeoViewport.bounds(center, zoom, [
      window.innerWidth,
      window.innerHeight
    ]);
    const startPoint = [viewBounds[0], viewBounds[1]];
    const endPoint = [viewBounds[2], viewBounds[1]];
    const viewportDistance = distance(startPoint, endPoint);

    /* once we know the viewport width, we can get the sidebar width */
    const percentageOfWidth = sidebarWidth / window.innerWidth;
    const shift = (viewportDistance * percentageOfWidth) / 2;

    /* once we know the width of the sidebar in kilemeters, we adjust the center */
    const { geometry } = destination(center, -shift, 90);

    return {
      center: geometry.coordinates,
      zoom: zoom - 1
    };
  }

  sidebarAwareZoom(bounds) {
    const viewport = this.getAdjustedViewport(bounds);

    if (this.state.flyTo && is(fromJS(this.state.flyTo), fromJS(viewport)))
      return;

    this.setState({
      flyTo: viewport
    });
  }

  onMapMouseDown({ features }) {
    const handle = features.find(f => f.layer.id == "handles");
    if (!handle) return;
    this.draggingPoint = {
      ...handle,
      id: handle.properties.id,
      trail: this.selectedTrails().find(t => t.id == handle.properties.trailId),
      geometry: handle.geometry,
      currentPointOnLine: handle.geometry.coordinates
    };
  }

  onMapMouseUp({ target }) {
    const activeHandle = this.activeHandle();
    if (!activeHandle) return;

    const { currentPointOnLine, trail, properties } = activeHandle;

    const collection = pointsToFeatureCollection(trail.points);
    const snapToPoint = nearest(currentPointOnLine, collection);

    this.props.updateHandle(
      activeHandle.properties.id,
      snapToPoint.properties.coordinates
    );

    this.props.setHandleIndex(
      activeHandle.properties.id,
      snapToPoint.properties.index,
      properties.cuttingStep,
      properties.uniqueId
    );

    this.draggingPoint = null;
    target.dragPan.enable();
  }

  applyRotation(points) {
    let rotatedPoints = [];
    points.filter(p1 => p1.properties.handleId == 0).forEach(p1 => {
      const p2 = points.filter(p2 => p2.properties.handleId == 1).find(p2 => {
        return p2.properties.uniqueId == p1.properties.uniqueId;
      });

      const rotation = bearing(p1, p2);
      p1.properties.rotation = rotation;
      p2.properties.rotation = rotation;

      rotatedPoints = [p1, p2, ...rotatedPoints];
    });

    return rotatedPoints;
  }

  getOffset(trails, i) {
    /*
      get an offset integer if segments overlap
    */
    const t1 = trails[i];

    const overlappingSegments = trails.filter(t2 => {
      return t1.id == t2.id && lineIntersect(t1.geometry, t2.geometry);
    });

    if (overlappingSegments.length <= 1) return 0;

    const index = overlappingSegments.findIndex(
      t2 => t1.uniqueId == t2.uniqueId
    );
    return index % 2 == 0 ? -1 : 1;
  }

  applyStyleAttributes(trails) {
    return trails.map((trail, i) => {
      trail.offset = this.getOffset(trails, i);
      trail.fill = theme.trailColors[i % 4];
      trail.active = trail.selected && trail.active;
      return trail;
    });
  }

  sliceTrails(trails) {
    return trails.map(trail => {
      return sliceElevationsWithHandles(trail, this.props.handles);
    });
  }

  sources() {
    return [
      {
        id: "trails-selected",
        data: trailsToFeatureCollection(
          this.applyStyleAttributes(this.sliceTrails(this.selectedTrails()))
        )
      },
      {
        id: "handles",
        data: featureCollection(
          this.applyRotation(
            this.props.handles.map((p, i) => {
              const group = Math.ceil((i + 1) / 2);
              return pointToPoint({ ...p, index: group % 4 });
            })
          )
        )
      }
    ];
  }

  featureStates() {
    let featureStates = [];
    if (this.state.previewElement)
      featureStates.push({
        ...this.state.previewElement,
        state: { preview: true }
      });

    if (this.props.boundary)
      featureStates.push({
        source: "local",
        sourceLayer: "national-parks",
        id: this.props.boundary.id,
        state: { preview: true }
      });

    return featureStates;
  }

  componentDidUpdate() {
    const { boundary } = this.props;

    if (boundary && boundary.bounds) {
      this.sidebarAwareZoom(boundary.bounds);
    }
  }

  getInitialViewport() {
    const query = parse(window.location.search, { arrayFormat: "bracket" });

    return query.bounds
      ? this.getAdjustedViewport(query.bounds.map(b => parseFloat(b)))
      : null;
  }

  render() {
    return (
      <Container innerRef={this.map} id="the-map">
        <MapBox
          sources={this.sources()}
          featureStates={this.featureStates()}
          flyTo={this.state.flyTo}
          initialViewport={this.getInitialViewport()}
          pointer={!!this.state.previewElement}
          watchLayers={WATCH_LAYERS}
          click={this.onMapClick.bind(this)}
          mousemove={this.onMapMouseMove.bind(this)}
          mouseup={this.onMapMouseUp.bind(this)}
          mousedown={this.onMapMouseDown.bind(this)}
        />
        <TrailControl previewElement={this.state.previewElement} />
      </Container>
    );
  }
}

Map.propTypes = {
  trails: PropTypes.array,
  boundary: PropTypes.object,
  handles: PropTypes.array,
  onTrailClick: PropTypes.func,
  onBoundaryClick: PropTypes.func,
  onNonFeatureClick: PropTypes.func,
  updateHandle: PropTypes.func,
  setHandleIndex: PropTypes.func,
  initialBounds: PropTypes.array
};

const Container = styled("div")`
  width: 100%;
  position: relative;
`;
