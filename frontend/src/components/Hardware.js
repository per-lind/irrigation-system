import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Action from './Action';
import { invoke } from '../actions';

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
    } = this.props;

    const definitions = (type || driver);
    const {
      readable,
      callable,
      readPayload,
      callPayload,
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
          {readable && <div className={classes.divider}><Divider /></div>}
          {readable &&
            <Action
              onClick={payload => invokeMethod('read', payload)}
              method={"read"}
              payload={readPayload}
              id={id}
            />
          }
          {callable && <div className={classes.divider}><Divider /></div>}
          {callable &&
            <Action
              onClick={payload => invokeMethod('call', payload)}
              method={"call"}
              payload={callPayload}
              id={id}
            />
          }
        </CardContent>
        {children}
      </Card>
    );
  }
}

function Hardware(props) {
  const { classes, ...rest } = props;

  return (
    <RenderItem
      {...rest}
      classes={classes}
      invokeMethod={(method, payload) => invoke(method, { ...payload, id: rest.id })}
    >
      {rest.relays &&
        rest.relays.map((relay, index) => (
          <RenderItem
            key={index}
            {...relay}
            classes={classes}
            invokeMethod={(method, payload) => invoke(method, { ...payload, relay: relay.id, id: rest.id })}
          />
        ))}
    </RenderItem>
  );
}

Hardware.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Hardware);
