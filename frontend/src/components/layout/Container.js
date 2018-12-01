import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Wrapper from '../Wrapper';

const styles = {
  root: {
    padding: 10,
  },
  container: {
    maxWidth: 1000,
    margin: '0 auto',
  },
};

function Container(props) {
  const {
    classes,
    children,
  } = props;

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Wrapper>
          {children}
        </Wrapper>
      </div>
    </div>
  );
}

Container.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Container);
