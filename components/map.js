import React, { Proptypes } from 'react';
import TooltipContainer from './tooltipContainer';
import MapBox from './mapBox';

export default class Map extends React.Component {

  onMapMouseMove(event) {
    if (event.features.length) {
      let trail_id = event.features[0].properties.id;
      if (this.props.previewTrails.some(t => t.id == trail_id)) return;
      this.props.onTrailMouseIn(trail_id);
    } else if (this.props.previewTrails.length) {
      this.props.onTrailMouseOut();
    }
  }

  onMapClick(event) {
    if (event.features.length) {
      this.props.onTrailClick(event.features[0].properties.id);
    } else if (this.props.selectedTrails.length){
      this.props.onNonTrailMapClick();
    }
  }

  onMapDrag(event) {
    this.props.setTrailsBox(event.bounds);
  }

  onMapLoad(event) {
    this.props.setTrailsBox(event.bounds);
  }

  activeTrailIds() {
    return [...this.props.previewTrails, ...this.props.selectedTrails].map(t => t.id);
  }

  render() {
    return (
        <div id="the-map">
          <MapBox
          activeTrailIDs={this.activeTrailIds()}
          trailsDataUrl={this.props.trailsDataUrl}
          onClick={this.onMapClick.bind(this)}
          onLoad={this.onMapLoad.bind(this)}
          onMouseMove={this.onMapMouseMove.bind(this)}
          onDrag={this.onMapDrag.bind(this)}/>
          <TooltipContainer/>
        </div>
    );
  }
}
