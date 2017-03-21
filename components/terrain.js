import React from 'react';
import {WebGLRenderer, Scene, PerspectiveCamera, TextureLoader, PlaneGeometry, MeshBasicMaterial, Mesh} from 'three';
import GeoViewport from 'geo-viewport';
import _ from 'underscore';


export default class Terrain extends React.Component {

  componentDidMount() {
    const scene = new Scene();
    const camera = new PerspectiveCamera(60, 1000 / 1200, 1, 100000);
    const renderer = new WebGLRenderer({alpha:true, canvas: this.refs.canvas});
    const view = GeoViewport.viewport(_.flatten(this.props.trail.bounds), [1024, 1024], 1, 17);
    const bounds = GeoViewport.bounds(view.center, view.zoom, [1024, 1024]);

    renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
    renderer.setSize(this.refs.canvasContainer.offsetWidth, this.refs.canvasContainer.offsetWidth);
    camera.position.z = 11000;

    fetch(new Request(`/api/elevation-dump/${bounds.join("/")}`)).then((r) => r.json()).then((altitude) => {
      fetch(new Request(`/api/terrain/${view.center.join("/")}/${view.zoom}`)).then((r) => r.json()).then((earth) => {
        renderMap(altitude, earth)
      })
    })

    const renderMap = function(altitude, earth) {
      let vertices = altitude.vertices;
      const texture = new TextureLoader().load(earth.url)
      const geometry = new PlaneGeometry(10240, 10240, altitude.height - 1, altitude.length - 1);
      const material = new MeshBasicMaterial({map: texture});
      const plane = new Mesh(geometry, material);

      plane.geometry.vertices.map((v,i) => {
        let z = vertices[i];
        if (z == null || z == NaN || z == undefined) {
          z = vertices[i - 1] || vertices[i + 1] || vertices[i - altitude.height] || vertices[i + altitude.height];
        };
        return Object.assign(v, {z: z})
      });

      plane.rotation.x = 5.7;
      scene.add(plane);

      function render() {
        requestAnimationFrame(render);
        renderer.render(scene, camera);

      }
      render()
    }.bind(this)
  }

  render() {
    return (
      <div ref="canvasContainer">
        <canvas ref="canvas" style={{width: '100% !important', height: 'auto !important'}}></canvas>
      </div>
    )
  }
};
