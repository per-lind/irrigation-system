import React from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Done, Warning } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';

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
    <div className={classes.root}>
      <Grid
        container
        spacing={8}
        direction="row"
        justify="flex-start"
        alignItems="center"
      >
        <Grid item>
          {healthy ? <Done className={classes.ok} /> : <Warning className={classes.notOk} />}
        </Grid>
        <Grid item>
          <Typography color="textSecondary">{healthy ? "healthy" : "disconnected"}</Typography>
        </Grid>
      </Grid>
    </div>
  );
}

Health.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Health);
