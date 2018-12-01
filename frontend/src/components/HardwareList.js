import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Hardware from './Hardware';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const styles = {
  root: {
  },
};

function HardwareList(props) {
  const {
    classes,
    hardware,
  } = props;

  if (!hardware || hardware === []) return <div></div>

  return (
    <div className={classes.root}>
      <Typography variant="h3" gutterBottom>Hardware</Typography>
      <Grid container className={classes.container} spacing={0}>
        {hardware.map((item, index) => (
          <Grid key={index} item xs={12}>
            <Hardware definitions={item} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

HardwareList.propTypes = {
  classes: PropTypes.object.isRequired,
  hardware: PropTypes.array,
};

export default withStyles(styles)(HardwareList);
