import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {
    overflow: 'scroll',
  },
};

function Wrapper(props) {
  const {
    classes,
    children,
  } = props;

  return (
    <div className={classes.root}>
      {children}
    </div>
  );
}

Wrapper.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Wrapper);
