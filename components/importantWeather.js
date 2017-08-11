import React from 'react';

export default class ImportantWeather extends React.Component {
  percentText(integer) {
    return (typeof(integer) == "number") ? parseInt(integer/10) + "%" : "0%";
  }
  
  render() {
    return (
      <div>
        Weather almanac: <br/>
        Chance of percipitation: {this.percentText(this.props.trail.chanceOfPercipitation)} <br/>
        High temperature: {this.props.trail.maxTemperature}° <br/>
        Low Temperature: {this.props.trail.minTemperature}°
      </div>
    )
  }
}
