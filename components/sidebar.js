import React from 'react';
import PropTypes from 'prop-types';
import TrailSidebar from './trailSidebar';
import BoundarySidebar from './boundarySidebar';
import Terrain from './terrain';
import cx from 'classnames';
import styles from '../styles/sidebar.css';
import sliceElevationsWithHandles from '../modules/sliceElevationsWithHandles';

const Sidebar = ({trails, boundary, handles}) => {
  const slicedTrails = () => {
    return trails.map(t => sliceElevationsWithHandles(t, handles));
  }

  const trailOrBoundary = () => {
    if (trails && trails.length) return <TrailSidebar firstTrail={slicedTrails()[0]} trails={slicedTrails()} handles={handles}/>
    if (boundary && boundary.selected) return <BoundarySidebar {...boundary}/>
  }

  const terrain = () => {
    return <Terrain
      satelliteImageUrl={(trails[0] || boundary || {}).satelliteImageUrl}
      points={(slicedTrails()[0] || {}).points}
      zoom={(trails[0] || boundary || {}).satelliteZoom}
      center={(trails[0] || boundary || {}).satelliteCenter}
      />
  }

  const hasContent = () => ((boundary && boundary.selected) || (trails && trails.some(t => t.selected)))

  const name = () => {
    if (trails.length) return (trails.length > 1) ? `${trails.length} Trails` : trails[0].name;
    if (boundary) return boundary.name;
  }

  return (
    <div className={cx(styles.body, {[styles.active]: hasContent()})}>
      <div className={styles.content}>
        <div className={styles.title}>{name()}</div>
        <div style={{display: (trails.length > 1) ? 'none' : 'block'}}>
          {terrain()}
        </div>
        {trailOrBoundary()}
      </div>
    </div>
  )
};

Sidebar.propTypes = {
  trails: PropTypes.array,
  boundary: PropTypes.object,
  handles: PropTypes.array
}

export default Sidebar;
