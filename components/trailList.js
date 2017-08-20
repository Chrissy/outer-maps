import React from 'react'
import {metersToMiles} from '../modules/conversions';
import cx from 'classnames';
import styles from '../styles/trailList.css';
import spacing from '../styles/spacing.css';
import Close from '../svg/close.svg';

export default class TrailList extends React.Component {
  listElement(trail) {
    return (
      <div className={cx(styles.listElement, spacing.marginBottomHalf)} key={trail.id}>
        <div className={styles.name}>{trail.name}</div>
        <div className={styles.info}>
          <div className={styles.dataElement}>{metersToMiles(trail.distance)}m</div>
          <Close className={styles.close}/>
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
