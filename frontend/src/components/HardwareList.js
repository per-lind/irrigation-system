import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Hardware from './Hardware';
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
      <Grid container className={classes.container} spacing={16}>
        {hardware.map((item, index) => (
          <Grid key={index} item xs={12} md={item.relays ? 12 : 6}>
            <Hardware key={index} definitions={item} />
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
