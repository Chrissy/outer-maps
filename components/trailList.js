import React from 'react'
import {metersToMiles} from '../modules/conversions';
import cx from 'classnames';
import styles from '../styles/trailList.css';
import spacing from '../styles/spacing.css';

export default class TrailList extends React.Component {
  listElement(trail) {
    return (
      <div className={cx(styles.listElement, spacing.marginBottomHalf)} key={trail.id}>
        <div>{trail.name}</div>
        <div>{metersToMiles(trail.distance)}</div>
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
