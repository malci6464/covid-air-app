import React from 'react';
import styles from '../buttons.module.css';

export function C19Legend(props) {
  if (props.currentC19List !== undefined) {
    return (
      <div>
        <p className={styles.wrapper} style={{ paddingBottom: '8px' }}>
          Covid-19 colour legend
        </p>
        <div className={styles.wrapper}>
          <span className={styles.progress}></span>
        </div>
        <div className={styles.flexCustom}>
          <p className={styles.def}>Min cases</p>
          <p className={styles.def}>
            Max cases {props.currentC19List[props.c19Total + 'Max']}
          </p>
          <p
            style={{
              display:
                props.currentC19List[props.c19Total + 'Max'] > 0
                  ? 'none'
                  : 'flex',
            }}
          >
            No data
          </p>
        </div>
      </div>
    );
  }
}
