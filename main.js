var React = require('react');
var ReactDOM = require('react-dom');
var MapGL = require('react-map-gl');

ReactDOM.render(
  <MapGL latitude={36.7933829} longitude={-118.6686774} zoom={11}
    onChangeViewport={(viewport) => {
      var {latitude, longitude, zoom} = viewport;
    }}
  />,
  document.getElementById("map")
);
