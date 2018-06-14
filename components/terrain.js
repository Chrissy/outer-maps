import React from "react";
import PropTypes from "prop-types";
import styles from "../styles/terrain.css";
import cx from "classnames";
import LoadingSpinner from "./loadingSpinner";
import FlatMercatorViewport from "../node_modules/viewport-mercator-project/dist/flat-mercator-viewport";
import pin from "../data/pin";

export default class Terrain extends React.Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
  }

  projectPoints({ points, zoom, center }) {
    if (!points || !zoom || !center) return [];

    const projecter = FlatMercatorViewport({
      longitude: center[0],
      latitude: center[1],
      zoom: zoom - 1,
      width: 1024,
      height: 1024
    });

    return this.props.points.map(p => {
      return { ...p, coordinates: projecter.project(p.coordinates) };
    });
  }

  drawPath(points) {
    const canvas = this.canvas;
    const ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!points.length) return;

    ctx.moveTo(...points[0].coordinates);
    points.slice(1).forEach(p => ctx.lineTo(...p.coordinates));
    ctx.lineJoin = "round";
    ctx.lineWidth = 8;
    ctx.strokeStyle = "white";
    ctx.setLineDash([10, 10]);
    ctx.stroke();

    const image = new Image();
    const [x1, y1] = points[0].coordinates;
    const [x2, y2] = points[points.length - 1].coordinates;
    const pinWidth = 44;
    const pinHeight = 60;
    image.onload = () => {
      ctx.drawImage(
        image,
        x1 - pinWidth / 2,
        y1 - pinHeight - 2,
        pinWidth,
        pinHeight
      );
      ctx.drawImage(
        image,
        x2 - pinWidth / 2,
        y2 - pinHeight - 2,
        pinWidth,
        pinHeight
      );
    };
    image.src = pin;
  }

  isVisible() {
    return this.props.satelliteImageUrl;
  }

  componentDidUpdate() {
    if (this.props.satelliteImageUrl) {
      this.projectedPoints = this.projectPoints(this.props);
      this.drawPath(this.projectedPoints);
    }
  }

  render() {
    return (
      <div className={cx(styles.terrain)}>
        <img
          src={this.props.satelliteImageUrl}
          className={cx(styles.image, { [styles.visible]: this.isVisible() })}
        />
        <canvas
          ref={this.canvas}
          width="1026"
          height="1026"
          className={cx(styles.canvas, { [styles.visible]: this.isVisible() })}
        />
        <div
          className={cx(styles.loadingSpinner, {
            [styles.visible]: !this.isVisible()
          })}
        >
          <LoadingSpinner speed="1s" />
        </div>
      </div>
    );
  }
}

Terrain.propTypes = {
  points: PropTypes.array,
  satelliteImageUrl: PropTypes.string,
  zoom: PropTypes.number,
  center: PropTypes.array
};
