import React from 'react';
import {WebGLRenderer, Scene, PerspectiveCamera, TextureLoader, PlaneGeometry, MeshBasicMaterial, Mesh} from 'three';
import GeoViewport from 'geo-viewport';

export default class Terrain extends React.Component {

  componentDidMount() {
    const TRAIL_ID = 58128;
    var scene = new Scene();
    var camera = new PerspectiveCamera(60, 1000 / 1200, 1, 100000);
    var renderer = new WebGLRenderer({alpha:true, canvas: this.refs.canvas});
    renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
    camera.position.z = 11000;
    camera.position.x = 0;
    camera.position.y = 500;
    renderer.setSize(this.refs.canvasContainer.offsetWidth, this.refs.canvasContainer.offsetWidth);

    fetch(new Request(`/api/trails/${TRAIL_ID}`)).then(function(response){
      return response.json();
    }).then(function(trail){
      const request_viewport = GeoViewport.viewport([trail.bounds[0][0],trail.bounds[0][1],trail.bounds[1][0],trail.bounds[1][1]], [1024, 1024], 1, 17);
      const bounds = GeoViewport.bounds(request_viewport.center, request_viewport.zoom, [1024, 1024]);
      fetch(new Request(`/api/elevation-dump/${bounds[0]}/${bounds[1]}/${bounds[2]}/${bounds[3]}`)).then(function(response){
        return response.json();
      }).then(function(altitude){
        fetch(new Request(`/api/trails/terrain/${TRAIL_ID}`)).then(function(response){
          return response.blob();
        }).then(function(earth){
          renderMap(altitude, earth)
        })
      })
    })

    const renderMap = function(altitude, earth) {
      let vertices = altitude.vertices;
      const texture = new TextureLoader().load(URL.createObjectURL(earth))
      var geometry = new PlaneGeometry(10240, 10240, altitude.height - 1, altitude.length - 1);
      var material = new MeshBasicMaterial({map: texture});
      var plane = new Mesh(geometry, material);

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

  componentDidUpdate() {

  }

  render() {
    return (
      <div ref="canvasContainer">
        <canvas ref="canvas" style={{width: '100% !important', height: 'auto !important'}}></canvas>
      </div>
    )
  }
};
