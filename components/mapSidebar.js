import React from 'react'

export default class MapSidebar extends React.Component {

  render() {
    return (
      <div style={{
        position: 'absolute',
        height: 'calc(100% - 2em)',
        width: '25vw',
        minWidth: '300px',
        margin: '1em',
        background: '#fefefe',
        boxSizing: 'border-box'
      }}></div>
    )
  }
};
