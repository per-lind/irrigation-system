import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Hardware from './Hardware';
import Grid from '@material-ui/core/Grid';
import _ from 'lodash';
import { context } from '../utilities';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1),
  },
}));

function HardwareList() {
  const classes = useStyles();
  const { hardware } = useContext(context);
  if (!hardware || hardware === []) return <div></div>

  return (
    <div className={classes.root}>
      <Grid container className={classes.container} spacing={1}>
        {hardware.map((item, index) => (
          <Grid key={index} item xs={12} md={6}>
            <Hardware key={index} {...item} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default HardwareList;
