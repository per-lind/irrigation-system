import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import _ from 'lodash';
import { context } from '../utilities';

const styles = theme => ({
});

class CancelJobs extends Component {
  state = { success: undefined, failure: undefined };

  handleClick = () => {
    const { socket } = this.context;
    socket.send('invoke', { method: 'cancel' })
      .then(() => this.setState({ success: true }))
      .catch(() => this.setState({ failure: true }))
      .finally(() => {
        // Clear method invoke feedback
        setTimeout(
          () => this.setState({ success: undefined, failure: undefined }),
          3000
        );
      })
  }

  render() {
    const { classes } = this.props;
    const { success, failure } = this.state;

    return (
      <div className={classes.root}>
        <Button
          size="small"
          color="secondary"
          variant="contained"
          onClick={this.handleClick}
        >
          Cancel jobs
        </Button>
        {success && "success"}
        {failure && "failure"}
      </div>
    );
  }
}

CancelJobs.contextType = context;

CancelJobs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CancelJobs);
