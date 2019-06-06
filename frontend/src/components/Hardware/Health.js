import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Done, Close } from '@material-ui/icons';

const styles = theme => ({
  ok: {
    color: theme.palette.primary.dark,
  },
  notOk: {
    color: theme.palette.error.dark,
  },
});

function Health(props) {
  const {
    classes,
    healthy,
  } = props;

  return (
    <Tooltip title={healthy ? "healthy" : "disconnected"}>
      {healthy ? <Done className={classes.ok} /> : <Close className={classes.notOk} />}
    </Tooltip>
  );
}

Health.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Health);
