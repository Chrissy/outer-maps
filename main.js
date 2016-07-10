var React = require('react');
var ReactDOM = require('react-dom');
var MapGL = require('react-map-gl');
var window = require('global/window');
var document = require('global/document');

var Map = React.createClass({
  getInitialState: function() {
    return {
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        latitude: 36.7933829,
        longitude: -118.6686774,
        mapStyle: 'mapbox://styles/mapbox/outdoors-v9',
        zoom: 10,
        isDragging: false,
        mapboxApiAccessToken: 'pk.eyJ1IjoiZml2ZWZvdXJ0aHMiLCJhIjoiY2lvMXM5MG45MWFhenUybTNkYzB1bzJ0MiJ9._5Rx_YN9mGwR8dwEB9D2mg'
      }
    }
  },

  componentDidMount: function() {
    window.addEventListener('resize', function() {
      this.setState({
        viewport: Object.assign({}, this.state.viewport, {
          width: window.innerWidth,
          height: window.innerHeight
        })
      });
    }.bind(this));
  },

  render: function() {
    return (
      <MapGL {...this.state.viewport}/>
    );
  }
})

ReactDOM.render(<Map />, document.getElementById("map"));
