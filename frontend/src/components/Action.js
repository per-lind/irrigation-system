import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Input from './Input';

const styles = {
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  }
};

class Action extends Component {
  state = { payload: {} };

  handleChange = (name, value) => {
    this.setState({ payload: { ...this.state.payload, [name]: value } })
  }

  render() {
    const {
      classes,
      onClick,
      method,
      payload,
    } = this.props;

    return (
      <div className={classes.root}>
        {payload &&
          payload.map((item, index) =>
            <Input
              key={index}
              {...item}
              onChange={this.handleChange}
              value={this.state.payload[item.id]}
            />
          )
        }
        <div className={classes.buttonContainer}>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={() => onClick(this.state.payload)}
          >
            {method}
          </Button>
        </div>
      </div>
    );
  }
}

Action.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Action);
