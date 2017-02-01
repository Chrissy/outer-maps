export default [
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
]
