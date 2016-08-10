import React, { Proptypes } from 'react';
import TooltipContainer from './tooltipContainer';
import MapBox from './mapBox';

export default class Map extends React.Component {

  constructor() {
    super()

    this.state = {cat:false}
  }

  onMapMouseMove(event) {
    if (event.features.length) {
      this.props.onTrailMouseIn(event.features[0].properties.id);
    } else if (this.props.lastHoveredTrail) {
      this.props.onTrailMouseOut();
    }
  }

  onMapClick(event) {
    if (event.features.length) {
      this.props.onTrailClick(event.features[0].properties.id);
    } else if (this.props.activeTrails.length){
      this.props.onNonTrailMapClick();
    }
  }

  onMapDrag(event) {}

  onMapLoad(event) {
    this.setState({cat:`/api/${event.bounds._sw.lng}/${event.bounds._sw.lat}/${event.bounds._ne.lng}/${event.bounds._ne.lat}`});
  }

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
          trailsDataUrl={this.state.cat}
          onClick={this.onMapClick.bind(this)}
          onLoad={this.onMapLoad.bind(this)}
          onMouseMove={this.onMapMouseMove.bind(this)}
          onDrag={this.onMapDrag.bind(this)}/>
          <TooltipContainer/>
        </div>
    );
  }
}
