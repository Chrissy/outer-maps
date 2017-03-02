export const mapBoxLayers = [
  {
    'id': 'trails',
    'source': 'trails-data',
    'type': 'line',
    'paint': {
      'line-color': 'transparent',
      'line-width': 15
    }
  },
  {
    'id': 'trails-outline',
    'source': 'trails-data',
    'type': 'line',
    'paint': {
      'line-color': '#fff',
      'line-width': 4,
      'line-opacity': 0.3
    }
  },
  {
    'id': 'trails-core-line',
    'source': 'trails-data',
    'type': 'line',
    'paint': {
      'line-color': '#0DB224',
      'line-width': 2
    }
  },
  {
    'id': 'trails-active',
    'source': 'trails-data',
    'type': 'line',
    'filter': ["==", "id", 0],
    'paint': {
      'line-color': '#FF9100',
      'line-width': 2,
    }
  },
  {
    'id': 'boundaries',
    'source': 'boundaries-data',
    'type': 'fill',
    'paint': {
      'fill-color': 'rgba(0, 0, 0, 0%)'
    }
  },
  {
    'id': 'boundaries-active-outline',
    'source': 'boundaries-data',
    'type': 'line',
    'filter': ["==", "id", 0],
    'layout': {
      'line-join': 'round'
    },
    'paint': {
      'line-color': 'hsl(119, 77%, 100%)',
      'line-width': 2,
      'line-opacity': 0.9
    }
  },
  {
    'id': 'boundaries-active',
    'source': 'boundaries-data',
    'type': 'fill',
    'filter': ["==", "id", 0],
    'paint': {
      'fill-color': 'hsl(119, 77%, 70%)',
      'fill-opacity': 0.2
    }
  }
]
