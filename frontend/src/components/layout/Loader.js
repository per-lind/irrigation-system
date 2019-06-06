import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    position: "sticky",
    bottom: 0,
  },
});

function Loader({ loading }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Fade
        in={loading}
        style={{
          transitionDelay: loading ? '800ms' : '0ms',
        }}
        unmountOnExit
      >
        <LinearProgress />
      </Fade>
    </div>
  );
}
export default Loader;
