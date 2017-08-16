import React from 'react';
import styles from '../styles/welcome.css';
import center from '../styles/center.css'
import spacing from '../styles/spacing.css';
import cx from 'classnames';
import Close from '../svg/close.svg';

export default class Tooltip extends React.Component {

  close(e) {
    this.setState({closed: true});
  }

  constructor(props) {
    super(props);

    this.state = {
      closed: false,
    };
  }

  render() {
    return (
      <div className={cx(styles.welcome, center.flex, {[styles.closed]: this.state.closed})} onClick={(e) => this.close(e)}>
        <div className={styles.content}>
          <img src="/rocks.png" className={styles.image}/>
          <div className={cx(styles.title, spacing.marginTopHalf)}>Welcome to Trail Gunk!</div>
          <div className={cx(styles.text, spacing.marginTop, spacing.marginBottom)}>
            It isn't totally done yet, but look—one doesn't simply
            build an interactive map of all your favorite parks overnight.
            <br /><br />
            It will work on all the latest greatest browers. Currently only Washington, Utah, and Idaho are
            supported. If you are interested in contributing to
            or following the progress of Trail Gunk, head over to the <a  className={styles.link} href="https://github.com/Chrissy/trails-up">Github Repo</a>.
          </div>
        </div>
        <Close className={styles.close}/>
      </div>
    )
  }
};
