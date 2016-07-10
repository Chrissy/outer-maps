var React = require('react');
var ReactDOM = require('react-dom');
var MapboxGL = require('mapbox-gl');

MapboxGL.accessToken = 'pk.eyJ1IjoiZml2ZWZvdXJ0aHMiLCJhIjoiY2lvMXM5MG45MWFhenUybTNkYzB1bzJ0MiJ9._5Rx_YN9mGwR8dwEB9D2mg'

var Map = React.createClass({

  loadTrailsWithinBox: function(){
    if (!this.mapboxed) return;

    var bounds = this.mapboxed.getBounds();

    this.mapboxed.addSource('trails-data', {
      'type': 'geojson',
      'data': `/api/${bounds._sw.lng}/${bounds._sw.lat}/${bounds._ne.lng}/${bounds._ne.lat}`
    })

    this.mapboxed.addLayer({
      'id': 'trails',
      'source': 'trails-data',
      'type': 'line',
      'paint': {
        'line-color': '#47B05A',
        'line-width': 4
      }
    })

    this.mapboxed.addLayer({
      'id': 'trails-active',
      'source': 'trails-data',
      'type': 'line',
      'paint': {
        'line-color': '#FF9100',
        'line-width': 4
      },
      "filter": ["==", "id", ""]
    })
  },

  getInitialState: function() {
    return {}
  },

  componentDidMount: function() {
    this.mapboxed = new MapboxGL.Map({
      container: 'mapbox-gl-element',
      style: 'mapbox://styles/mapbox/outdoors-v9',
      center: [-118.6686774, 36.7933829],
      zoom: 10
    });

    this.mapboxed.on('load', function(){
      this.loadTrailsWithinBox()
    }.bind(this))
  },

  render: function() {
    return (
      <div id="mapbox-gl-element"></div>
    );
  }
})

ReactDOM.render(<Map />, document.getElementById("map"));
