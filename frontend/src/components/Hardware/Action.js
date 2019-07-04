import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Input from '../Input';
import { formatter } from '../../utilities';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import { Done, Close } from '@material-ui/icons';

const styles = theme => ({
  content: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  go: {
    marginTop: theme.spacing(1),
  },
  success: {
    color: theme.palette.primary.dark,
  },
  failure: {
    color: theme.palette.error.dark,
  },
  data: {
    marginTop: theme.spacing(2),
  },
});

class Action extends Component {
  state = {
    selected: {},
    success: undefined,
    failure: undefined,
  };

  handleChange = (name, value) => {
    this.setState({ selected: { ...this.state.selected, [name]: value } })
  };

  handleClick = () => {
    this.setState({ success: undefined, failure: undefined });
    this.props.onClick(this.state.selected)
      .then(() => this.setState({ success: true }))
      .catch(() => this.setState({ failure: true }))
      .finally(() => {
        // Clear method invoke feedback
        setTimeout(
          () => this.setState({ success: undefined, failure: undefined }),
          3000
        );
      })
  };

  render() {
    const {
      classes,
      payload,
      response,
      value,
      loading,
    } = this.props;

    const {
      success,
      failure,
    } = this.state;

    return (
      <React.Fragment>
        <Divider />
        <CardContent classes={{root: classes.content}}>
          {payload &&
            Object.keys(payload).map((payloadId, index) => {
              const item = payload[payloadId];
              return (
                <Input
                  key={index}
                  {...item}
                  label={item.name || payloadId}
                  id={payloadId}
                  onChange={this.handleChange}
                  value={this.state.selected[payloadId]}
                />
              );
            })
          }
          <div className={classes.go}>
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={this.handleClick}
              disabled={loading}
            >
              {payload ? "GO" : "READ"}
            </Button>
          </div>
          {success && <Done className={classes.success} />}
          {failure && <Close className={classes.failure} />}
          {value &&
            Object.keys(value).map(key => {
              const { name, unit } = response[key] || {};
              return (
                <Typography key={key} className={classes.data} >
                  {name || key}: {formatter[unit] ? formatter[unit](value[key]) : `${value[key]} ${unit}`}
                </Typography>
              )
            })
          }
        </CardContent>
      </React.Fragment>
    )
  }
}

Action.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Action);
