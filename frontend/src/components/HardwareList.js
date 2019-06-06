import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Hardware from './Hardware';
import Grid from '@material-ui/core/Grid';
import _ from 'lodash';

const styles = theme => ({
  root: {
    padding: theme.spacing(1),
  },
});

function HardwareList(props) {
  const {
    classes,
    hardware,
  } = props;

  if (!hardware || hardware === []) return <div></div>

  return (
    <div className={classes.root}>
      <Grid container className={classes.container} spacing={1}>
        {hardware.map((item, index) => (
          <Grid key={index} item xs={12} md={_.get(item, "driver.relays") ? 12 : 6}>
            <Hardware key={index} {...props} {...item} />
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
