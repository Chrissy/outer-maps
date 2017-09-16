import {WebGLRenderer, Scene, PerspectiveCamera, TextureLoader, PlaneGeometry, MeshBasicMaterial, Mesh, DefaultLoadingManager} from 'three';
import PropTypes from 'prop-types';
import GeoViewport from '@mapbox/geo-viewport';
import _ from 'underscore';


const Terrain = ({index, height, width, bounds, vertices}) => {

  const getEarth = () => {
    fetch(new Request(`/api/terrain/${this.view.center.join("/")}/${this.view.zoom}`)).then((r) => r.json()).then(function(resp) {
      this.earth = resp;
      this.drawMap();
    }.bind(this));
  }

  const drawMap = () => {
    if (!this.earth) return;

    let vertices = this.props.vertices;
    const loader = new TextureLoader();
    loader.crossOrigin = '';
    const texture = loader.load(this.earth.url);
    const geometry = new PlaneGeometry(200, 200, this.props.height - 1, this.props.width - 1);
    const material = new MeshBasicMaterial({map: texture});
    const plane = new Mesh(geometry, material);

    plane.geometry.vertices.map((v,i) => {
      let z = vertices[i];
      if (z == null || z == NaN || z == undefined) {
        z = vertices[i - 1] || vertices[i + 1] || vertices[i - this.props.height] || vertices[i + this.props.height];
      };
      return Object.assign(v, { z: z / 100 })
    });

    plane.rotation.x = 5.7;

    this.scene.add(plane);
  }

  const clearMap = () => {
    this.earth = null;
    this.altitude = null;

    this.scene.children.forEach(function(object) {
      this.scene.remove(object);
    }.bind(this));

    this.renderMap();
  }

  const initializeCanvas = () => {
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
    }

    DefaultLoadingManager.onLoad = function() {
      this.renderMap();
    }.bind(this);

    this.initialized = true;
  }

  const draw = () => {
    this.view = GeoViewport.viewport(_.flatten(this.props.bounds), [1024, 1024], 12, 14);

    this.clearMap();
    this.getEarth();
  }

  draw();
};

Terrain.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  bounds: PropTypes.array,
  vertices: PropTypes.array
}

Terrain({...injectedJson});
