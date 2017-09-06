import React from 'react'
import {metersToMiles} from '../modules/conversions';
import cx from 'classnames';
import styles from '../styles/trailList.css';
import spacing from '../styles/spacing.css';
import Close from '../svg/close.svg';
import sliceElevationsWithHandles from '../modules/sliceElevationsWithHandles';

export default class TrailList extends React.Component {
  constructor(props) {
    super(props);

    this.unselectTrail = this.unselectTrail.bind(this);
  }

  unselectTrail(trail) {
    this.props.unselectTrail(trail.id);
  }

  trailDistance(trail) {
    if (!trail.hasElevationData) return '';
    return metersToMiles(sliceElevationsWithHandles(trail, this.props.handles).points.reduce((a, e) => {
      return a + e.distanceFromPreviousPoint
    }, 0)) + "m";
  }

  listElement(trail) {
    return (
      <div className={cx(styles.listElement, spacing.marginBottomHalf)} key={trail.id}>
        <div className={styles.name}>{trail.name}</div>
        <div className={styles.info}>
          <div className={styles.dataElement}>{this.trailDistance(trail)}</div>
          <Close className={styles.close} onClick={(e) => this.unselectTrail(trail)}/>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className={cx(styles.trailList, spacing.marginBottomTriple, spacing.marginTopHalf, spacing.horizontalPadding)}>
        {this.props.trails.map(t => this.listElement(t))}
      </div>
    )
  }
};
