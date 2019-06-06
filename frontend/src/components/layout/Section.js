import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

const styles = theme => ({
  root: {
    padding: 10,
  },
  container: {
    maxWidth: 1200,
    margin: '0 auto',
    overflow: 'hidden',
    paddingTop: theme.spacing(3),
  },
  title: {
  },
  divider: {
    marginTop: theme.spacing(3),
  },
});

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
      <Divider className={classes.divider} />
    </div>
  );
}

Section.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Section);
