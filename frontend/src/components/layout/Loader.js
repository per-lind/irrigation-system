import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Fade from '@material-ui/core/Fade';
import { context } from '../../utilities';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    position: "sticky",
    bottom: 0,
  },
});

function Loader() {
  const classes = useStyles();
  const { loading } = useContext(context);

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
