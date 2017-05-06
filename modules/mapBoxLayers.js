export const mapBoxLayers = [
  {
    "id": "handles-center",
    "source": "handles",
    "type": "circle",
    "before": "handles",
    "paint": {
      "circle-radius": 4,
      "circle-color": "#FF9100"
    }
  },
  {
    "id": "handles-outline",
    "source": "handles",
    "type": "circle",
    "before": "handles-center",
    "paint": {
      "circle-radius": 6,
      "circle-color": "#FFF"
    }
  },
  {
    "id": "handles",
    "source": "handles",
    "type": "circle",
    "paint": {
      "circle-radius": 8,
      "circle-color": "rgba(0,0,0,0)"
    }
  },
  {
    "id": "labels",
    "source": "labels",
    "type": "symbol",
    "layout": {
      "text-field": "{name}",
      "symbol-placement": "line",
      "text-size": {"stops": [[10, 9], [12, 11]]},
      "text-max-angle": 180,
      "symbol-spacing": 500
    },
    "paint": {
      "text-color": "rgba(0,33,4,1)",
      "text-halo-color": "hsla(0, 0%, 100%, 100%)",
      "text-halo-width": 1,
      "text-halo-blur": 0.5,
    },
    "filter": ["all", ["in", "type", "hike", "horse"], ["!=", "name", ""]]
  }
]
