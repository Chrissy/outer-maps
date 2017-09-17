const {WebGLRenderer, Scene, PerspectiveCamera, DataTexture, PlaneGeometry, ShaderMaterial, Mesh, WebGLRenderTarget, RGBAFormat, UnsignedByteType} = require('three');
const GeoViewport = require('@mapbox/geo-viewport');
const gl = require('gl')(1,1);
const jsdom = require('jsdom');
const _ = require('underscore');
const fetch = require('node-fetch');
const accessToken =  'pk.eyJ1IjoiZml2ZWZvdXJ0aHMiLCJhIjoiY2lvMXM5MG45MWFhenUybTNkYzB1bzJ0MiJ9._5Rx_YN9mGwR8dwEB9D2mg';
const dom = new jsdom.JSDOM('<!DOCTYPE html>');
const window = dom.window;
const document = dom.window.document;
const threePngStream = require('three-png-stream');
const PNG = require('pngjs').PNG
const fs = require('fs');
const jimp = require('jimp');

const Terrain = ({bounds}) => {

  const getElevations = (bounds) => {
    return fetch(`http://0.0.0.0:5000/api/elevations/${bounds.join("/")}`).then(r => r.json());
  }

  const getEarth = () => {
    return new Promise((resolve, reject) => {
      //const {center: [x, y], zoom} = GeoViewport.viewport(bounds, [1024, 1024]);
      //const url = `http://api.mapbox.com/v4/mapbox.satellite/${x},${y},${zoom}/1024x1024.jpg70?access_token=${accessToken}`;

      png = jimp.read('./testt.png').then((image) => {
        resolve(new DataTexture(image.flip(false, true).bitmap.data, 1024, 1024, RGBAFormat));
      });
    });
  }

  const createPlane = (earth, vertices) => {
    const geometry = new PlaneGeometry(200, 200, 99, 99);
    const material = new ShaderMaterial();

    material.vertexShader = `
      varying vec2 vUv;

      void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
    `;
    material.fragmentShader = `
      uniform sampler2D dataTexture;
      varying vec2 vUv;
      void main() {
          gl_FragColor = texture2D(dataTexture, vUv);
      }
    `;
    material.uniforms = {dataTexture: { type: "t", value: earth }}
    material.needsUpdate = true
    earth.needsUpdate = true
    const plane = new Mesh(geometry, material);

    plane.geometry.vertices.map((v,i) => Object.assign(v, { z: vertices[i] / 100 }));
    plane.rotation.x = 5.7;

    return plane;
  }

  const initializeScene = (plane) => {
    const scene = new Scene({autoUpdate: false});
    const camera = new PerspectiveCamera(44, 1, 0.1, 1000);
    const target = new WebGLRenderTarget(800, 800, {format: RGBAFormat});
    camera.position.y = -20;
    camera.position.z = 200;
    const canvas = new Object();
    const renderer = new WebGLRenderer({antialias: true, width: 0, height: 0, context: gl, canvas});
    scene.add(plane);
    renderer.render(scene, camera, target, true);
    return renderer;
  };

  const draw = async () => {
    const [earth, elevations] = await Promise.all([getEarth(), getElevations(bounds)]);
    const renderer = await initializeScene(createPlane(earth, elevations));
    const png = new PNG({ width: 800, height: 800 });
    const pixels = new Uint8Array(4 * 800 * 800);
    renderer.getContext().readPixels(0, 0, 800, 800, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    for (j = 0; j < 800; j++) {
      for (i = 0; i < 800; i++) {
        k = j * 800 + i
        r = pixels[4*k]
        g = pixels[4*k + 1]
        b = pixels[4*k + 2]
        a = pixels[4*k + 3]

        m = (800 - j + 1) * 800 + i
        png.data[4*m]     = r
        png.data[4*m + 1] = g
        png.data[4*m + 2] = b
        png.data[4*m + 3] = a
      }
    }

    const stream = fs.createWriteStream("./test.png")
    png.pack().pipe(stream);
  }

  return draw();
};

exports.render = () => Terrain({
  bounds: GeoViewport.bounds([-119.3189, 48.3698], 12, [1024, 1024]),
});
