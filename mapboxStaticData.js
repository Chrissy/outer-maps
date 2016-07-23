export const accessToken = MapboxGL.accessToken = 'pk.eyJ1IjoiZml2ZWZvdXJ0aHMiLCJhIjoiY2lvMXM5MG45MWFhenUybTNkYzB1bzJ0MiJ9._5Rx_YN9mGwR8dwEB9D2mg';

export const trailsLayerStatic = {
  'id': 'trails',
  'source': 'trails-data',
  'type': 'line',
  'paint': {
    'line-color': '#47B05A',
    'line-width': 4
  }
}

export const trailsLayerActive = Object.assign({}, trailsLayerStatic, {
  'id': 'trails-active',
  'paint': { 'line-color': '#FF9100'},
  'filter': ["==", "id", ""]
})
