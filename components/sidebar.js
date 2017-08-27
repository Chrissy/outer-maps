import React from 'react';
import TrailSidebar from './trailSidebar';
import BoundarySidebar from './boundarySidebar';
import cx from 'classnames';
import styles from '../styles/sidebar.css';
import spacing from '../styles/spacing.css';

export default class MapSidebar extends React.Component {
  trailOrBoundary() {
    if (this.props.trails.length) return <TrailSidebar firstTrail={this.props.firstTrail} trails={this.props.trails}/>
    if (this.props.boundary) return <BoundarySidebar trail={this.props.boundary}/>
  }
  
  hasContent() {
    return !!(this.props.trails.length || this.props.boundary)
  }
    
  name() {
    if (this.props.trails.length) return (this.props.trails.length > 1) ? `${this.props.trails.length} Trails` : this.props.firstTrail.name;
    if (this.props.boundary) return this.props.boundary.name;
  }

  render() {
    return (
      <div className={cx(styles.body, {[styles.active]: this.props.loading})}>
        <div className={cx(styles.content, {[styles.active]: this.hasContent()})}>
          <div className={styles.title}>{this.name()}</div>
          {this.trailOrBoundary()}
        </div>
      </div>
    )
  }
};
