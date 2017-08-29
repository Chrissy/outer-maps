import React from 'react';
import PropTypes from 'prop-types';
import TrailSidebar from './trailSidebar';
import BoundarySidebar from './boundarySidebar';
import cx from 'classnames';
import styles from '../styles/sidebar.css';
import spacing from '../styles/spacing.css';

const Sidebar = ({trails, firstTrail, boundary, loading}) => {
  const trailOrBoundary = () => {
    if (trails.length) return <TrailSidebar firstTrail={firstTrail} trails={trails}/>
    if (boundary) return <BoundarySidebar boundary={boundary}/>
  }
  
  const hasContent = () => {
    return !!(trails.length || boundary)
  }
    
  const name = () => {
    if (trails.length) return (trails.length > 1) ? `${trails.length} Trails` : firstTrail.name;
    if (boundary) return boundary.name;
  }

  return (
    <div className={cx(styles.body, {[styles.active]: loading})}>
      <div className={cx(styles.content, {[styles.active]: hasContent()})}>
        <div className={styles.title}>{name()}</div>
        {trailOrBoundary()}
      </div>
    </div>
  )
};

Sidebar.propTypes = {
  trails: PropTypes.array,
  firstTrail: PropTypes.object,
  boundary: PropTypes.object,
  loading: PropTypes.bool
}

export default Sidebar;
