import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Action from './Action';
import _ from 'lodash';
import Health from './Health';
import { Typography } from '@material-ui/core';
import { context } from '../../utilities';

const styles = theme => ({
  divider: {
    marginTop: 15,
    marginBottom: 15,
  },
  avatar: {
    backgroundColor: theme.palette.primary.dark,
  },
});

class Hardware extends Component {
  state = { data: {} };

  handleInvoke = (method, payload) => {
    const { socket } = this.context;
    socket.send('invoke', { payload, method });
  }

  render() {
    const { classes, id, name, driver } = this.props;
    const { loading } = this.context;
    const { data } = this.state;

    const { methods, healthy } = driver || this.props;
    const { name: driverName } = driver || {};
    const invokeMethod = (method, payload) => this.handleInvoke(method, { payload, id });

    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar className={classes.avatar}>
              {name[0]}
            </Avatar>
          }
          action={<Health healthy={healthy} />}
          title={name}
          subheader={driverName}
        />
        {methods && Object.values(methods).map(method => {
          const responseData = _.get(data, [method.id, id]);
          return (
            <Action
              key={method.id}
              onClick={payload => invokeMethod(method.id, payload)}
              value={responseData}
              method={method.id}
              {...method}
              id={id}
              loading={loading}
            />
          )
        })}
        {driver && driver.relays &&
          Object.values(driver.relays).map((relay, index) => (
            <React.Fragment key={index}>
              <CardContent>
                <Typography>{relay.name}</Typography>
                {relay.driver && <Health healthy={driver.healthy} />}
              </CardContent>
              {relay.methods && Object.values(relay.methods).map(method => {
                const responseData = _.get(data, [method.id, id, relay.id]);
                return (
                  <Action
                    key={method.id}
                    onClick={payload => invokeMethod(
                      method.id,
                      { ...payload, relay: relay.id }
                    )}
                    value={responseData}
                    method={method.id}
                    {...method}
                    id={id}
                    loading={loading}
                  />
                )
              })}
          </React.Fragment>
        ))}
      </Card>
    );
  }
}

Hardware.contextType = context;

Hardware.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Hardware);
