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
    "id": "trails-selected-outline",
    "source": "trails-selected",
    "type": "line",
    "before": "trails-selected",
    "line": {
      "line-cap": "round",
      "line-join": "bevel"
    },
    "paint": {
      "line-color": "#FFF",
      "line-width": 4
    }
  },
  {
    "id": "trails-selected",
    "source": "trails-selected",
    "type": "line",
    "before": "handles-outline",
    "line": {
      "line-cap": "round",
      "line-join": "bevel"
    },
    "paint": {
      "line-color": "#FF9100",
      "line-width": 2
    }
  }
]
