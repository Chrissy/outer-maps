var React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      <div>
        name: {this.props.name}<br/>
        source: {this.props.source}
      </div>
    )
  }
});
