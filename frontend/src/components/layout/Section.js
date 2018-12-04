import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Wrapper from '../Wrapper';
import Typography from '@material-ui/core/Typography';

const styles = {
  root: {
    padding: 10,
  },
  container: {
    maxWidth: 1200,
    margin: '0 auto',
    overflow: 'hidden',
  },
  title: {
  },
};

function Section(props) {
  const {
    classes,
    title,
    children,
  } = props;

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <div className={classes.title}>
          <Typography variant="h3" gutterBottom>{title}</Typography>
        </div>
        {children}
      </div>
    </div>
  );
}

Section.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Section);
