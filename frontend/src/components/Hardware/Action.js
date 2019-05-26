import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Input from '../Input';
import { formatter } from '../../utilities';
import Divider from '@material-ui/core/Divider';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import classnames from 'classnames';
import CardContent from '@material-ui/core/CardContent';

const styles = theme => ({
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  card: {
    maxWidth: 400,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  actions: {
    display: 'flex',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
});

class Action extends Component {
  state = {
    selected: {},
    expanded: false,
  };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  handleChange = (name, value) => {
    this.setState({ selected: { ...this.state.selected, [name]: value } })
  };

  handleClick = () => {
    this.setState({ expanded: true });
    this.props.onClick(this.state.selected);
  };

  render() {
    const {
      classes,
      method,
      payload,
      response,
      value,
    } = this.props;

    const {
      expanded,
    } = this.state;

    return (
      <React.Fragment>
        <Divider />
        <CardActions className={classes.actions} disableActionSpacing>
          <Button
            size="small"
            color="primary"
            onClick={payload ? this.handleExpandClick : this.handleClick}
          >
            {method}
          </Button>
          {(value || payload) &&
            <IconButton
              className={classnames(classes.expand, {
                [classes.expandOpen]: expanded,
              })}
              onClick={this.handleExpandClick}
              aria-expanded={expanded}
              aria-label="Show more"
            >
              <ExpandMoreIcon />
            </IconButton>
          }
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
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
            {payload &&
              <Button
                size="small"
                color="primary"
                onClick={this.handleClick}
              >
                GO
              </Button>
            }
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
        </Collapse>
      </React.Fragment>
    )
  }
}

Action.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Action);
