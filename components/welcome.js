import React from 'react';
import styles from '../styles/welcome.css';
import center from '../styles/center.css'
import spacing from '../styles/spacing.css';
import cx from 'classnames';
import Close from '../svg/close.svg';

export default class Tooltip extends React.Component {

  close(e) {
    this.setState({closed: true});
    localStorage.setItem('welcomeMessageClosed', true);
  }

  constructor(props) {
    super(props);
    this.state = {
      closed: localStorage.getItem('welcomeMessageClosed') == 'true'
    };
  }

  render() {
    return (
      <div className={cx(styles.welcome, center.flex, {[styles.closed]: this.state.closed})} onClick={(e) => this.close(e)}>
        <div className={styles.content}>
          <img src="https://s3-us-west-2.amazonaws.com/chrissy-gunk/rocks.jpg" className={styles.image}/>
          <div className={cx(styles.title, spacing.marginTop)}>Welcome to the Trail Gunk demo!</div>
          <div className={cx(styles.text, spacing.marginTop, spacing.marginBottom)}>
            It isn't totally done yet, but look—one doesn't simply
            build an interactive map of all your favorite parks overnight.
            <br /><br />
            It will work on all the latest modern browers. Currently only data for Washington, Utah, and Idaho are
            added. If you are interested in contributing to
            or following the progress of Trail Gunk, head over to the <a className={styles.link} href="https://github.com/Chrissy/trails-up" onClick={(e) => e.stopPropagation()}>Github Repo</a>.
          </div>
        </div>
        <Close className={styles.close}/>
      </div>
    )
  }
};
