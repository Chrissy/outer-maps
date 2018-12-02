import React from "react";
import PropTypes from "prop-types";
import { Manager, Popper } from "react-popper";
import pointOnLine from "@turf/point-on-line";
import nearest from "@turf/nearest";
import bearing from "@turf/bearing";
import { point, featureCollection } from "@turf/helpers";
import {
  pointToPoint,
  pointsToFeatureCollection,
  trailsToFeatureCollection
} from "../modules/stateToGeoJson";
import MapBox from "./mapBox";
import Svg from "./svg";
import getOffsetCenter from "../modules/getOffsetCenter";
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

  activeTrail() {
    return this.props.trails.find(t => t.selected && t.active);
  }

  selectedBoundary() {
    return this.props.boundaries.find(boundary => boundary.selected);
  }

  elementIsSelected() {
    return !!(this.selectedBoundary() || this.selectedTrails().length);
  }

  onMapMouseMove({ target, features: [feature], point, lngLat }) {
    const { draggingPoint } = this;

    if (!feature && !draggingPoint) {
      if (this.state.previewElement) {
        target.dragPan.enable();
        return this.setState({
          previewElement: null
        });
      }
    } else {
      if (draggingPoint || feature.layer.id == "handles") {
        this.handleDrag({ target, lngLat });
      } else if (
        feature.layer.id == "trails" ||
        feature.layer.id == "national-park-labels"
      ) {
        target.dragPan.enable();
        this.handleFeatureHover(feature, point);
      }
    }
  }

  handleFeatureHover({ properties, layer }, point) {
    if (
      this.state.previewElement &&
      this.state.previewElement.id == properties.id &&
      this.state.previewElement.sourceLayer == layer["source-layer"]
    )
      return;

    this.setState({
      previewElement: {
        id: properties.id,
        sourceLayer: layer["source-layer"],
        source: layer.source,
        point,
        ...properties
      }
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

  onMapClick({ features, lngLat }) {
    const feature = features[0] || null;
    const { draggingPoint, props } = this;

    if (draggingPoint) return;
    if (!feature && this.elementIsSelected()) return props.onNonFeatureClick();
    if (!feature) return;

    const type = feature.layer.id;

    if (type == "trails" || type == "trails-selected") {
      this.setState({ activeTrailLngLat: lngLat });
      props.onTrailClick({
        properties: feature.properties,
        geometry: feature.geometry,
        activeSegment: type == "trails-selected"
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

  sources() {
    return [
      {
        id: "trails-selected",
        data: trailsToFeatureCollection(
          this.selectedTrails().map((t, i) => {
            t.fill = theme.trailColors[i % 4];
            return sliceElevationsWithHandles(t, this.props.handles);
          })
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

    if (this.selectedBoundary())
      featureStates.push({
        source: "local",
        sourceLayer: "national-parks",
        id: this.selectedBoundary().id,
        state: { preview: true }
      });
    return featureStates;
  }

  tooltip() {
    return this.state.previewElement
      ? [
        {
          content: <div>{this.state.previewElement.name}</div>,
          lngLat: this.state.previewElement.lngLat
        }
      ]
      : [];
  }

  activeTooltip() {
    return this.activeTrail()
      ? [
        {
          content: <div>{this.activeTrail().name}</div>,
          lngLat: this.state.activeTrailLngLat
        }
      ]
      : [];
  }

  referenceElement() {
    const { point } = this.state.previewElement;

    class VirtualReference {
      getBoundingClientRect() {
        return {
          top: point.y,
          left: point.x,
          bottom: point.y,
          right: point.x,
          width: 0,
          height: 0
        };
      }

      get clientWidth() {
        return this.getBoundingClientRect().width;
      }
      get clientHeight() {
        return this.getBoundingClientRect().height;
      }
    }

    return new VirtualReference();
  }

  render() {
    return (
      <Container innerRef={this.map} id="the-map">
        <Manager>
          <MapBox
            sources={this.sources()}
            featureStates={this.featureStates()}
            flyTo={this.state.flyTo}
            pointer={!!this.state.previewElement}
            watchLayers={WATCH_LAYERS}
            click={this.onMapClick.bind(this)}
            mousemove={this.onMapMouseMove.bind(this)}
            mouseup={this.onMapMouseUp.bind(this)}
            mousedown={this.onMapMouseDown.bind(this)}
          />
          {this.state.previewElement && (
            <Popper referenceElement={this.referenceElement()} placement="auto">
              {({ ref, style, placement }) => (
                <Tooltip
                  innerRef={ref}
                  style={style}
                  data-placement={placement}
                >
                  <Contents>Popper Tooltip</Contents>
                  <Tip src="tip" placement={placement} />
                </Tooltip>
              )}
            </Popper>
          )}
        </Manager>
      </Container>
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

const Container = styled("div")`
  width: 100%;
  position: relative;
`;

const Contents = styled("div")`
  padding: 0.5em;
  color: #fff;
  font-size: 0.875em;
`;

const Tooltip = styled("div")`
  border-radius: 0.5em;
  background: ${p => p.theme.orange};
  border: 2px solid #fff;
`;

const getXTransform = ({ placement }) => {
  switch (placement) {
  case "left":
    // a bit of a magic number, it has to do with the aspect ratio and the rotation transform
    return -30;
  case "right":
    //same here
    return -70;
  default:
    return -50;
  }
};

const getYTransform = ({ placement }) => {
  switch (placement) {
  case "top":
    return 0;
  case "bottom":
    return -100;
  default:
    return -50;
  }
};

const getLeft = ({ placement }) => {
  switch (placement) {
  case "left":
    return 100;
  case "right":
    return 0;
  default:
    return 50;
  }
};

const getTop = ({ placement }) => {
  switch (placement) {
  case "top":
    return 100;
  case "bottom":
    return 0;
  default:
    return 50;
  }
};

const getRotation = ({ placement }) => {
  switch (placement) {
  case "bottom":
    return 180;
  case "left":
    return 270;
  case "right":
    return 90;
  default:
    return 0;
  }
};

const Tip = styled(Svg)`
  position: absolute;
  height: 8px;
  color: ${p => p.theme.orange};
  left: ${getLeft}%;
  top: ${getTop}%;
  transform: translate(${getXTransform}%, ${getYTransform}%)
    rotate(${getRotation}deg);
`;
