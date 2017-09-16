import {WebGLRenderer, Scene, PerspectiveCamera, TextureLoader, PlaneGeometry, MeshBasicMaterial, Mesh} from 'three';
import GeoViewport from '@mapbox/geo-viewport';
import _ from 'underscore';
import injectedJson from '../public/dist/terrain.json';

const accessToken =  'pk.eyJ1IjoiZml2ZWZvdXJ0aHMiLCJhIjoiY2lvMXM5MG45MWFhenUybTNkYzB1bzJ0MiJ9._5Rx_YN9mGwR8dwEB9D2mg';

const Terrain = ({height, width, canvas, bounds}) => {

  const getElevations = (bounds) => {
    return fetch(`/api/terrain/${bounds.join("/")}`).then(r => r.json());
  }

  const getEarth = () => {
    return new Promise((resolve, reject) => {
      const {center: [x, y], zoom} = GeoViewport.viewport(bounds, [1024, 1024]);
      const url = `http://api.mapbox.com/v4/mapbox.satellite/${x},${y},${zoom}/1024x1024.jpg70?access_token=${accessToken}`;
      const loader = new TextureLoader();
      loader.crossOrigin = '';

      loader.load(url, (image) => resolve(image))
    })
  }

  const createPlane = (earth, vertices) => {
    const geometry = new PlaneGeometry(200, 200, 99, 99);
    const material = new MeshBasicMaterial({map: earth});
    const plane = new Mesh(geometry, material);

    plane.geometry.vertices.map((v,i) => Object.assign(v, { z: vertices[i] / 100 }));
    plane.rotation.x = 5.7;

    return plane;
  }

  const initializeScene = (plane) => {
    return new Promise((resolve, reject) => {
      const scene = new Scene({autoUpdate: false});

      const camera = new PerspectiveCamera(42, 1, 0.1, 1000);
      camera.position.y = -20;
      camera.position.z = 200;

      const renderer = new WebGLRenderer({canvas: canvas});
      renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

      scene.add(plane);
      renderer.render(scene, camera);
    })
  };

  const draw = async () => {
    const [earth, elevations] = await Promise.all([getEarth(), getElevations(bounds)]);
    initializeScene(createPlane(earth, elevations));
  }

  draw();
};

Terrain({
  height: 800,
  width: 800,
  bounds: GeoViewport.bounds([-120.3189, 48.3698], 12, [1024, 1024]),
  canvas: document.getElementById("canvas")
});
