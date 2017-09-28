import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/terrain.css';
import center from '../styles/center.css';
import cx from 'classnames';
import LoadingSpinner from './loadingSpinner';
import {FlatMercatorViewport} from 'viewport-mercator-project';
import GeoViewport from '@mapbox/geo-viewport';


export default class Terrain extends React.Component {

  projectPoints({points, bounds}) {
    if (!points || !bounds) return [];
    const tile = GeoViewport.viewport(bounds, [1024, 1024])
    const projecter = FlatMercatorViewport({longitude: tile.center[0], latitude: tile.center[1], zoom: tile.zoom - 1, width: 1024, height: 1024});
    return this.props.points.map(p => {
      return {...p, coordinates: projecter.project(p.coordinates)}
    });
  }

  drawPath(points) {
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!points.length) return;
    ctx.moveTo(...points[0].coordinates);
    points.slice(1).forEach(p => ctx.lineTo(...p.coordinates))
    ctx.strokeStyle = 'white';
    ctx.lineJoin = "round";
    ctx.lineWidth = 6;
    ctx.setLineDash([10, 10]);
    ctx.stroke();
  }

  isVisible() {
    return (this.props.satelliteImageUrl);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.points !== this.props.points) {
      this.drawPath(this.projectPoints(this.props));
    }
  }

  render() {
    return (
      <div className={cx(styles.terrain, styles.center)}>
        <img src={this.props.satelliteImageUrl} className={cx(styles.image, {[styles.visible]: this.isVisible()})}/>
        <canvas ref="canvas" width="1026" height="1026" className={cx(styles.canvas, {[styles.visible]: this.isVisible()})}></canvas>
        <div className={cx(styles.loadingSpinner, {[styles.visible]: !this.isVisible()})}><LoadingSpinner speed="1s"/></div>
      </div>
    )
  }
};

Terrain.propTypes = {
  points: PropTypes.array,
  satelliteImageUrl: PropTypes.string
}
