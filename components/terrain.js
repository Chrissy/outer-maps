import React from 'react';
import PropTypes from 'prop-types';
import {WebGLRenderer, Scene, PerspectiveCamera, TextureLoader, CanvasTexture, PlaneGeometry, MeshBasicMaterial, Mesh} from 'three';
import styles from '../styles/terrain.css';
import center from '../styles/center.css';
import cx from 'classnames';
import _ from 'underscore';
import LoadingSpinner from './loadingSpinner';


export default class Terrain extends React.Component {

  updateSatelliteImage(mesh, satelliteImageUrl) {
    return new Promise((resolve, reject) => {
      new TextureLoader().load(this.props.satelliteImageUrl, (img) => {
        mesh.material.map = img;
        mesh.material.needsUpdate = true;
        resolve();
      });
    });
  }

  updatePathLayer(mesh, points) {
    if (!points.length) return;
    const canvas = document.getElementById('test-canvas');
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.moveTo(...points[0].coordinates);
    points.slice(1).forEach(p => ctx.lineTo(...p.coordinates))
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 10;
    ctx.setLineDash([15, 10]);
    ctx.stroke();
    mesh.material.map = new CanvasTexture(canvas);
  }

  updateVertices(meshes, vertices) {
    return new Promise((resolve, reject) => {
      meshes.forEach(mesh => {
        mesh.geometry.vertices.map((v,i) => Object.assign(v, { z: this.props.vertices[i] / 100 }));
        mesh.geometry.verticesNeedUpdate = true;
        resolve();
      })
    });
  }

  createMesh(scene) {
    const geometry = new PlaneGeometry(200, 200, 99, 99);
    const material = new MeshBasicMaterial({transparent: true});
    const mesh = new Mesh(geometry, material);
    mesh.rotation.x = 5.7;
    return mesh;
  }

  initializeCanvas() {
    const scene = new Scene({autoUpdate: false});
    const aspectRatio = this.refs.canvasContainer.offsetWidth / this.refs.canvasContainer.offsetHeight;
    const camera = new PerspectiveCamera(90 / aspectRatio, aspectRatio, 0.1, 1000);
    const renderer = new WebGLRenderer({canvas: this.refs.canvas});

    camera.position.y = -20;
    camera.position.z = 200;
    renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
    renderer.setSize(this.refs.canvasContainer.offsetWidth, this.refs.canvasContainer.offsetHeight);

    return {scene, renderer, camera};
  }

  renderScene({renderer, scene, camera}) {
    window.requestAnimationFrame(() => {
      renderer.render(scene, camera);
    })
  }

  componentDidMount() {
    const {scene, renderer, camera} = this.initializeCanvas();
    const meshes = [this.createMesh(), this.createMesh()];
    meshes.forEach(mesh => scene.add(mesh));
    Object.assign(this, {scene, renderer, camera, meshes});
  }

  isVisible() {
    return (this.props.vertices && this.props.satelliteImageUrl);
  }

  componentDidUpdate(prevProps) {
    if (this.props.vertices && prevProps.vertices !== this.props.vertices) {
      this.updateVertices(this.meshes, this.props.vertices).then(() => {
        this.renderScene({...this});
      });
    }

    if (this.props.satelliteImageUrl && prevProps.satelliteImageUrl !== this.props.satelliteImageUrl) {
      this.updateSatelliteImage(this.meshes[0], this.props.satelliteImageUrl).then(() => {
        this.renderScene({...this});
      });
    }

    if (this.props.points && prevProps.points !== this.props.points) {
      this.updatePathLayer(this.meshes[1], this.props.points);
      this.renderScene({...this});
    }
  }

  render() {
    return (
      <div ref="canvasContainer" className={cx(styles.terrain, styles.center)}>
        <canvas ref="canvas" className={cx(styles.canvas, {[styles.visible]: this.isVisible()})}></canvas>
        <div className={cx(styles.loadingSpinner, {[styles.visible]: !this.isVisible()})}><LoadingSpinner speed="1s"/></div>
      </div>
    )
  }
};

Terrain.propTypes = {
  vertices: PropTypes.array,
  satelliteImageUrl: PropTypes.string
}
