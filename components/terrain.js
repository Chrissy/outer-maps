import React from 'react';
import PropTypes from 'prop-types';
import {WebGLRenderer, Scene, PerspectiveCamera, TextureLoader, PlaneGeometry, MeshBasicMaterial, Mesh, DefaultLoadingManager} from 'three';
import styles from '../styles/terrain.css';
import center from '../styles/center.css';
import cx from 'classnames';
import _ from 'underscore';


export default class Terrain extends React.Component {

  drawMap() {
    const size = Math.sqrt(this.props.vertices.length) - 1;
    const geometry = new PlaneGeometry(200, 200, size, size);
    const material = new MeshBasicMaterial();
    const mesh = new Mesh(geometry, material);

    mesh.geometry.vertices.map((v,i) => Object.assign(v, { z: this.props.vertices[i] / 100 }));
    mesh.rotation.x = 5.7;

    new TextureLoader().load(this.props.satelliteImageUrl, function(img){
      mesh.material.map = img;
      mesh.material.needsUpdate = true;
      this.scene.add(mesh);
      this.renderMap();
    }.bind(this));
  }

  clearMap() {
    this.scene.children.forEach(function(object) {
      this.scene.remove(object);
    }.bind(this));

    this.renderMap();
  }

  initializeCanvas() {
    this.scene = new Scene({autoUpdate: false});

    const aspectRatio = this.refs.canvasContainer.offsetWidth / this.refs.canvasContainer.offsetHeight;

    const camera = new PerspectiveCamera(52 / aspectRatio, aspectRatio, 0.1, 1000);
    camera.position.y = -20;
    camera.position.z = 200;

    const renderer = new WebGLRenderer({canvas: this.refs.canvas});
    renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
    renderer.setSize(this.refs.canvasContainer.offsetWidth, this.refs.canvasContainer.offsetHeight);

    this.renderMap = function() {
      renderer.render(this.scene, camera);
      console.log("render called")
    }

    this.initialized = true;
  }

  draw() {
    this.clearMap();
    this.drawMap();
  }

  componentDidMount() {
    this.initializeCanvas();
    this.draw()
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
