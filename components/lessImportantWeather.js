import React from 'react';

export default class ElevationTotals extends React.Component {
  percentText(integer) {
    return (typeof(integer) == "number") ? parseInt(integer/10) + "%" : "0%";
  }

  render() {
    return (
      <div>
        Chance of heavy percipitation: {this.percentText(this.props.trail.chanceOfHeavyPercipitation)} <br/>
        Chance of snow: {this.percentText(this.props.trail.chanceOfSnow)} <br/>
        Chance of heavy snow: {this.percentText(this.props.trail.chanceOfHeavySnow)} <br/>
        Chance of snowpack: {this.percentText(this.props.trail.chanceOfSnowPack)} <br/>
        Chance of heavy snowpack: {this.percentText(this.props.trail.chanceOfHeavySnowPack)}
      </div>
    )
  }

}
