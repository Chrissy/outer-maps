import React from 'react';
import {WebGLRenderer, Scene, PerspectiveCamera, TextureLoader, PlaneGeometry, MeshBasicMaterial, Mesh, DefaultLoadingManager} from 'three';
import GeoViewport from '@mapbox/geo-viewport';
import styles from '../styles/terrain.css';
import center from '../styles/center.css';
import cx from 'classnames';
import _ from 'underscore';


export default class Terrain extends React.Component {

  getEarth() {
    fetch(new Request(`/api/terrain/${this.view.center.join("/")}/${this.view.zoom}`)).then((r) => r.json()).then(function(resp) {
      this.earth = resp;
      this.drawMap();
    }.bind(this));
  }

  drawMap() {
    if (!this.earth) return;

    let vertices = this.props.vertices;

    const loader = new TextureLoader();
    loader.crossOrigin = '';
    const texture = loader.load(this.earth.url);
    const geometry = new PlaneGeometry(10240, 10240, this.props.height - 1, this.props.width - 1);
    const material = new MeshBasicMaterial({map: texture});
    const plane = new Mesh(geometry, material);

    plane.geometry.vertices.map((v,i) => {
      let z = vertices[i];
      if (z == null || z == NaN || z == undefined) {
        z = vertices[i - 1] || vertices[i + 1] || vertices[i - this.props.height] || vertices[i + this.props.height];
      };
      return Object.assign(v, {z: z})
    });

    plane.rotation.x = 5.7;

    this.scene.add(plane);
  }

  clearMap() {
    this.earth = null;
    this.altitude = null;

    this.scene.children.forEach(function(object) {
      this.scene.remove(object);
    }.bind(this));

    this.renderMap();
  }

  initializeCanvas() {
    this.scene = new Scene({autoUpdate: false});
    const camera = new PerspectiveCamera(60, 1000 / 1200, 1, 100000);
    const renderer = new WebGLRenderer({canvas: this.refs.canvas});

    renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
    renderer.setSize(this.refs.canvasContainer.offsetWidth * 1.3, this.refs.canvasContainer.offsetWidth * 1.3);
    camera.position.z = 11000;

    this.renderMap = function() {
      renderer.render(this.scene, camera);
    }

    DefaultLoadingManager.onLoad = function() {
      this.renderMap();
    }.bind(this);

    this.initialized = true;
  }
  
  draw() {
    this.view = GeoViewport.viewport(_.flatten(this.props.bounds), [1024, 1024], 1, 14);

    this.clearMap();
    this.getEarth();
  }
  
  componentDidMount() {
    this.initializeCanvas();
    this.draw()
  }

  componentDidUpdate(prevProps) {    
    if (this.props.index !== prevProps.index) this.draw();
  }

  render() {
    return (
      <div ref="canvasContainer" className={cx(styles.terrain, styles.center)}>
        <canvas ref="canvas" className={styles.canvas}></canvas>
      </div>
    )
  }
};
