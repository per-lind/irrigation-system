import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { formatter } from '../utilities';

const styles = {
  slider: {
    padding: '0px 0px',
  },
};

function Input(props) {
  const {
    classes,
    id,
    label,
    type,
    min,
    max,
    onChange,
    value,
    unit,
  } = props;

  let item;

  switch(type) {
    case 'integer':
      item = (
        <Grid container
          direction="row"
          justify="flex-start"
          alignItems="center"
          spacing={3}
        >
          <Grid item>
            <Typography variant="subtitle1">{label}: </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Slider
              className={classes.slider}
              value={value || 0}
              min={min}
              max={max}
              step={1}
              onChange={(event, value) => onChange(id, value)}
            />
          </Grid>
          <Grid item>
            <Typography variant="caption">{formatter[unit] ? formatter[unit](value) : value}</Typography>
          </Grid>
        </Grid>
      )
      break;
    default:
      return <div>Failed to render input</div>;
  }

  return (
    <div className={classes.root}>
      {item}
    </div>
  );
}

Input.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Input);
