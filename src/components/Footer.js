import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import Pool from '@material-ui/icons/Pool';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  footer: {
    backgroundColor: theme.palette.primary[200],
    padding: 20,
  },
  text: {
    color: 'white',
  },
  logo: {
    color: 'white',
    width: 20,
    height: 20,
  }
});

const Footer = props => (
  <div className={props.classes.footer}>
    <Grid
      container
      alignItems='center'
      justify='center'
      spacing={16}
      >
      <Grid item>
        <Pool className={props.classes.logo}/>
      </Grid>
      <Grid item>
        <Typography className={props.classes.text}>
          Irrigation system
        </Typography>
      </Grid>
    </Grid>
  </div>
);

export default withStyles(styles)(Footer);
