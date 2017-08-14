import React from 'react'
import cx from 'classnames';
import styles from '../styles/header.css';
import center from '../styles/center.css';
import Wordmark from '../svg/wordmark.svg';

export default class Header extends React.Component {
  render() {
    return (
      <div className={cx(styles.body, center.flex)}>
        <Wordmark className={styles.wordmark}/>
      </div>
    )
  }
};
