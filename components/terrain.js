import React from 'react';
import PropTypes from 'prop-types';
import {WebGLRenderer, Scene, PerspectiveCamera, TextureLoader, PlaneGeometry, MeshBasicMaterial, Mesh, DefaultLoadingManager} from 'three';
import styles from '../styles/terrain.css';
import center from '../styles/center.css';
import cx from 'classnames';
import _ from 'underscore';


export default class Terrain extends React.Component {

  updateMesh(mesh) {
    return new Promise((resolve, reject) => {
      mesh.geometry.vertices.map((v,i) => Object.assign(v, { z: this.props.vertices[i] / 100 }));
      mesh.rotation.x = 5.7;

      new TextureLoader().load(this.props.satelliteImageUrl, function(img){
        mesh.material.map = img;
        mesh.material.needsUpdate = true;
        resolve();
      }.bind(this));
    });
  }

  clearMap() {
    this.scene.children.forEach(function(object) {
      this.scene.remove(object);
    }.bind(this));

    this.renderMap();
  }

  createMesh(scene) {
    const size = Math.sqrt(this.props.vertices.length) - 1;
    const geometry = new PlaneGeometry(200, 200, size, size);
    const material = new MeshBasicMaterial();
    return new Mesh(geometry, material);
  }

  initializeCanvas() {
    const scene = new Scene({autoUpdate: false});
    const aspectRatio = this.refs.canvasContainer.offsetWidth / this.refs.canvasContainer.offsetHeight;
    const camera = new PerspectiveCamera(52 / aspectRatio, aspectRatio, 0.1, 1000);
    const renderer = new WebGLRenderer({canvas: this.refs.canvas});

    camera.position.y = -20;
    camera.position.z = 200;
    renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
    renderer.setSize(this.refs.canvasContainer.offsetWidth, this.refs.canvasContainer.offsetHeight);

    return {scene, renderer, camera};
  }

  draw() {
    this.clearMap();
    this.drawMap();
  }

  componentDidMount() {
    const {scene, renderer, camera} = this.initializeCanvas();
    const mesh = this.createMesh();
    scene.add(mesh);
    this.updateMesh(mesh).then(() => {
      renderer.render(scene, camera)
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.index !== prevProps.index) this.drawMap();
  }

  render() {
    return (
      <div ref="canvasContainer" className={cx(styles.terrain, styles.center)}>
        <canvas ref="canvas" className={styles.canvas}></canvas>
      </div>
    )
  }
};

Terrain.propTypes = {
  index: PropTypes.string,
  vertices: PropTypes.array,
  satelliteImageUrl: PropTypes.string
}
