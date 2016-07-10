var React = require('react');
var ReactDOM = require('react-dom');
var MapboxGL = require('mapbox-gl');

MapboxGL.accessToken = 'pk.eyJ1IjoiZml2ZWZvdXJ0aHMiLCJhIjoiY2lvMXM5MG45MWFhenUybTNkYzB1bzJ0MiJ9._5Rx_YN9mGwR8dwEB9D2mg'

var Map = React.createClass({
  getInitialState: function() {
    return {}
  },

  componentDidMount: function() {
    var map = new MapboxGL.Map({
      container: 'mapbox-gl-element',
      style: 'mapbox://styles/mapbox/outdoors-v9',
      center: [-118.6686774, 36.7933829],
      zoom: 10
    });
  },

  render: function() {
    return (
      <div id="mapbox-gl-element"></div>
    );
  }
})

ReactDOM.render(<Map />, document.getElementById("map"));
