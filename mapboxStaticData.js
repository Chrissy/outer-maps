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
