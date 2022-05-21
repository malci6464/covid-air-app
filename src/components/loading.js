import React from 'react';
import { apiLoading } from '../layers/flightPositionLayer';
import { loading, apiDelay } from '../processing/createRoutes';
import styles from '../buttons.module.css';

export function LoadingAnimation() {
  return (
    <div
      style={{
        maxWidth: 1600,
        maxHeight: 200,
        display: loading || apiLoading ? 'block' : 'none',
      }}
    >
      <div className={styles.loader}>
        <div className={styles.spinner}></div>
      </div>{' '}
      <p
        style={{
          display: loading ? 'block' : 'none',
        }}
      >
        Flight route data loading from api
      </p>
      <p
        style={{
          display: apiDelay ? 'block' : 'none',
        }}
      >
        There seems to be a delay / error on the api call <br></br>
        .... please try again later (info in devtools console)
      </p>
      <p
        style={{
          display: apiLoading ? 'block' : 'none',
        }}
      >
        Live flight locations loading from api <br></br> Zoom in close to see
        animation
      </p>
    </div>
  );
}
