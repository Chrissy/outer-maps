import React from 'react';
import PropTypes from 'prop-types';
import {WebGLRenderer, Scene, PerspectiveCamera, TextureLoader, CanvasTexture, PlaneGeometry, MeshBasicMaterial, Mesh} from 'three';
import styles from '../styles/terrain.css';
import center from '../styles/center.css';
import cx from 'classnames';
import _ from 'underscore';
import LoadingSpinner from './loadingSpinner';


export default class Terrain extends React.Component {

  updatePathLayer(points) {
    if (!points.length) return;
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.moveTo(...points[0].coordinates);
    points.slice(1).forEach(p => ctx.lineTo(...p.coordinates))
    ctx.strokeStyle = 'white';
    ctx.lineJoin = "round";
    ctx.lineWidth = 6;
    ctx.setLineDash([10, 10]);
    ctx.stroke();
  }

  createMesh(scene) {
    const geometry = new PlaneGeometry(200, 200, 99, 99);
    const material = new MeshBasicMaterial({transparent: true});
    const mesh = new Mesh(geometry, material);
    mesh.rotation.x = 5.7;
    return mesh;
  }

  isVisible() {
    return (this.props.vertices && this.props.satelliteImageUrl);
  }

  componentDidUpdate(prevProps) {
    if (this.props.points && prevProps.points !== this.props.points) {
      this.updatePathLayer(this.props.points);
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
  vertices: PropTypes.array,
  satelliteImageUrl: PropTypes.string
}
