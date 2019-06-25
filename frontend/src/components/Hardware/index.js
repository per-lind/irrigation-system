import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import Action from './Action';
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
  handleInvoke = (method, payload) => {
    const { socket } = this.context;
    return socket.send('invoke', { payload, method });
  }

  render() {
    const { classes, id, name, driver, response, payload } = this.props;
    const { loading, events } = this.context;

    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar className={classes.avatar}>
              {name[0]}
            </Avatar>
          }
          title={name}
          subheader={driver}
        />
        <Action
          key={id}
          onClick={payload => this.handleInvoke(id, { payload })}
          value={events[id]}
          method={id}
          response={response}
          payload={payload}
          loading={loading}
        />
      </Card>
    );
  }
}

Hardware.contextType = context;

Hardware.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Hardware);
