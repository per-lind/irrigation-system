import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Action from './Action';
import { invoke } from '../actions';
import _ from 'lodash';

const styles = {
  divider: {
    marginTop: 15,
    marginBottom: 15,
  }
};

class RenderItem extends Component {
  render () {
    const {
      classes,
      children,
      invokeMethod,
      id,
      name,
      type,
      driver,
      data,
    } = this.props;

    const definitions = (type || driver);
    const {
      methods,
      healthy,
    } = definitions;

    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h5" component="h2">
            {name}
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
            {definitions.name}
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
            Healthy: {healthy ? 'true': 'false'}
          </Typography>
          {methods && methods.map(method => {
            const responseData = _.get(data, [method.id, id]);
            return (
              <div>
                <div className={classes.divider}><Divider /></div>
                <div>{JSON.stringify(responseData)}</div>
                <Action
                  onClick={payload => invokeMethod(method.id, payload)}
                  method={method.id}
                  payload={method.payload}
                  id={id}
                />
              </div>
            )
          })}
        </CardContent>
        {children}
      </Card>
    );
  }
}

class Hardware extends Component {
  state = { data: {} };

  handleInvoke = (method, payload) =>
    invoke(method, payload)
    .then(result => {
      const data = this.state.data[method] || {};
      this.setState({ data: {
        ...this.state.data,
        [method]: { ...data, ...result }
      }});
    })
    .catch(response => {
      console.log(response);
    });

  render() {
    const { classes, ...rest } = this.props;

    return (
      <RenderItem
        {...rest}
        classes={classes}
        data={this.state.data}
        invokeMethod={(method, payload) => this.handleInvoke(method, { ...payload, id: rest.id })}
      >
        {rest.relays &&
          <Grid container spacing={16}>
            {rest.relays.map((relay, index) => (
              <Grid key={index} item xs={12} md={6}>
                <RenderItem
                  key={index}
                  {...relay}
                  data={this.state.data}
                  classes={classes}
                  invokeMethod={(method, payload) => this.handleInvoke(method, { ...payload, relay: relay.id, id: rest.id })}
                />
              </Grid>
            ))}
          </Grid>
        }
      </RenderItem>
    );
  }
}

Hardware.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Hardware);
