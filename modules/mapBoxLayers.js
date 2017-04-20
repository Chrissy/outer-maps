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
      "circle-radius": 8,
      "circle-color": "rgba(0,0,0,0)"
    }
  },

  {
    'id': 'trails-labels',
    'source': 'trails-for-labels',
    'type': 'symbol',
    "layout": {
      "text-field": "{name}",
      'symbol-placement': 'line',
      'text-size': 8,
      'text-letter-spacing': .25,
      'text-max-angle': 120,
      'symbol-spacing': 500,
      'text-transform': 'uppercase',
      'text-anchor': 'bottom',
      'text-offset': [0, -1],
      "text-font": [
        "DIN Offc Pro Medium",
        "Arial Unicode MS Bold"
      ],
    },
    "paint": {
      "text-color": "rgba(0,103,14, .85)",
      'text-halo-color': 'hsla(0, 0%, 100%, 100%)',
      'text-halo-width': 1
    },
    "filter": ["all", ["in", "type", "hike", "horse", "mixed"], ["!=", "name", ""]]
  },

  {
    'id': 'trails-labels-zoomed-in',
    'source': 'trails-for-labels-zoomed-in',
    'type': 'symbol',
    "layout": {
      "text-field": "{name}",
      'symbol-placement': 'line',
      'text-size': 10,
      'text-letter-spacing': .25,
      'text-max-angle': 120,
      'text-transform': 'uppercase',
      'text-anchor': 'bottom',
      'symbol-spacing': 500,
      'text-offset': [0, -3],
      "text-font": [
        "DIN Offc Pro Medium",
        "Arial Unicode MS Bold"
      ],
    },
    "paint": {
      "text-color": "rgba(0,103,14, .85)",
      'text-halo-color': 'hsla(0, 0%, 100%, 100%)',
      'text-halo-width': 1
    },
    "filter": ["all", ["in", "type", "hike", "horse", "mixed"], ["!=", "name", ""]]
  },

  // {
  //   'id': 'trails-for-labels-helper',
  //   'source': 'trails-for-labels',
  //   'type': 'line',
  //   'paint': {
  //     'line-color': 'rgba(200,0,50,1)',
  //     'line-width': 1,
  //   },
  //   "filter": ["all", ["in", "type", "hike", "trail", "horse"], ["!=", "name", ""]]
  // },
  //
  // {
  //   'id': 'trails-for-labels-helper-2',
  //   'source': 'trails-for-labels-zoomed-in',
  //   'type': 'line',
  //   'paint': {
  //     'line-color': 'rgba(200,0,50,1)',
  //     'line-width': 1,
  //   },
  //   "filter": ["all", ["in", "type", "hike", "trail", "horse"], ["!=", "name", ""]]
  // },

  {
    'id': 'trails',
    'source': 'trails',
    'type': 'line',
    'paint': {
      'line-color': 'transparent',
      'line-width': 15
    },
    "filter": ["in", "type", "hike", "horse", "bike", "atv", "motorcycle", "trail", "mixed"]
  },

  {
    'id': 'trails-core-line',
    'source': 'trails',
    'type': 'line',
    'before': 'hedges',
    'line': {
      'line-cap': 'round',
      'line-join': 'bevel'
    },
    'paint': {
      'line-color': 'rgba(0,103,14,1)',
      'line-width': 1,
      'line-dasharray': [4, 1]
    },
    "filter": ["all", ["in", "type", "hike", "trail", "horse"], ["!=", "name", ""]]
  },

  {
    'id': 'bike-core-line',
    'source': 'trails',
    'type': 'line',
    'before': 'hedges',
    'line': {
      'line-cap': 'round',
      'line-join': 'bevel'
    },
    'paint': {
      'line-color': 'rgba(160,160,160,1)',
      'line-width': 1,
      'line-dasharray': [4, 1]
    },
    "filter": ["all", ["in", "type", "bike", "mixed"], ["!=", "name", ""]]
  },

  {
    'id': 'trails-outline',
    'source': 'trails',
    'type': 'line',
    'before': 'trails-core-line',
    'line': {
      'line-cap': 'round',
      'line-join': 'bevel'
    },
    'paint': {
      'line-color': 'rgba(250,250,250,1)',
      'line-width': 3
    },
    "filter": ["all", ["in", "type", "hike", "horse", "bike", "trail", "mixed"], ["!=", "name", ""]]
  },

  {
    'id': 'atv-and-motorcycle-core-line',
    'source': 'trails',
    'type': 'line',
    'before': 'roads',
    'line': {
      'line-cap': 'round',
      'line-join': 'bevel'
    },
    'paint': {
      'line-color': 'rgba(180,180,180,1)',
      'line-width': 1,
      'line-dasharray': [2, 1]
    },
    "filter": ["any", ["in", "type", "atv", "motorcycle", "mixed"], ["==", "name", ""]]
  },

  {
    'id': 'trails-active',
    'source': 'trails-active',
    'type': 'line',
    'before': 'handles-outline',
    'line': {
      'line-cap': 'round',
      'line-join': 'bevel'
    },
    'paint': {
      'line-color': '#FF9100',
      'line-width': 2,
    }
  },

  {
    'id': 'boundaries-active-outline',
    'source': 'boundaries-active',
    'type': 'line',
    'before': 'water',
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
    'source': 'boundaries-active',
    'type': 'fill',
    'before': 'water',
    'paint': {
      'fill-color': 'hsl(119, 77%, 70%)',
      'fill-opacity': 0.2
    }
  },

  {
    'id': 'boundaries',
    'source': 'boundaries',
    'before': 'water',
    'type': 'fill',
    'paint': {
      'fill-color': 'rgba(0, 0, 0, 0%)'
    }
  }
]
