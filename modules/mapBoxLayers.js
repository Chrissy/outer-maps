export const mapBoxLayers = [
  {
    'id': 'handles-center',
    'source': 'handles',
    'type': 'circle',
    'before': 'handles',
    'paint': {
      "circle-radius": 4,
      "circle-color": "#FF9100"
    }
  },
  {
    'id': 'handles-outline',
    'source': 'handles',
    'type': 'circle',
    'before': 'handles-center',
    'paint': {
      "circle-radius": 6,
      "circle-color": "#FFF"
    }
  },
  {
    'id': 'handles',
    'source': 'handles',
    'type': 'circle',
    'paint': {
      "circle-radius": 10,
      "circle-color": "rgba(0,0,0,0)"
    }
  },
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
    'id': 'trails-active',
    'source': 'trails-data',
    'type': 'line',
    'before': 'handles-outline',
    'filter': ["==", "id", 0],
    'paint': {
      'line-color': '#FF9100',
      'line-width': 2,
    }
  },
  {
    'id': 'trails-core-line',
    'source': 'trails-data',
    'type': 'line',
    'before': 'water',
    'paint': {
      'line-color': '#0DB224',
      'line-width': 2
    }
  },
  {
    'id': 'trails-outline',
    'source': 'trails-data',
    'type': 'line',
    'before': 'trails-core-line',
    'paint': {
      'line-color': '#fff',
      'line-width': 4,
      'line-opacity': 0.3
    }
  },
  {
    'id': 'boundaries-active-outline',
    'source': 'boundaries-data',
    'type': 'line',
    'before': 'water',
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
    'before': 'water',
    'filter': ["==", "id", 0],
    'paint': {
      'fill-color': 'hsl(119, 77%, 70%)',
      'fill-opacity': 0.2
    }
  },
  {
    'id': 'boundaries',
    'source': 'boundaries-data',
    'before': 'water',
    'type': 'fill',
    'paint': {
      'fill-color': 'rgba(0, 0, 0, 0%)'
    }
  },
]
