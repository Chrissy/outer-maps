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
  }
]
