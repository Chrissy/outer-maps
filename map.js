import React, { Proptypes } from 'react';
import TooltipContainer from './tooltipContainer';
import MapBox from './mapBox';

export default class Map extends React.Component {

  onMapMouseMove(event) {
    if (event.features.length) {
      this.props.onTrailMouseIn(event.features[0].properties.id);
    } else {
      this.props.onTrailMouseOut();
    }
  }

  onMapClick(event) {
    if (event.features.length) {
      this.props.onTrailClick(event.features[0].properties.id);
    } else {
      this.props.onNonTrailMapClick();
    }
  }

  onMapDrag(event) {}

  onMapLoad(event) {}

  combinedActiveTrailIds() {
    return [...this.props.activeTrails, this.props.lastHoveredTrail]
      .filter(trail => trail && trail.id)
      .map(trail => parseInt(trail.id));
  }

  render() {
    return (
        <div id="the-map">
          <MapBox
          activeTrailIDs={this.combinedActiveTrailIds()}
          onClick={this.onMapClick.bind(this)}
          onLoad={this.onMapLoad.bind(this)}
          onMouseMove={this.onMapMouseMove.bind(this)}
          onDrag={this.onMapDrag.bind(this)}/>
          <TooltipContainer/>
        </div>
    );
  }
}
