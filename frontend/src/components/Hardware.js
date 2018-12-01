import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const styles = {
};

class RenderItem extends Component {
  render () {

    const {
      classes,
      definitions,
      children,
    } = this.props;

    const {
      id,
      name,
      driver,
      readable,
      callable,
      relays,
    } = definitions;

    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h5" component="h2">
            {name}
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
            {driver}
          </Typography>
        </CardContent>
        <CardActions>
          {readable && <Button size="small">Read</Button>}
          {callable && <Button size="small">Invoke</Button>}
        </CardActions>
        {children}
      </Card>
    );
  }
}

function Hardware(props) {
  const {
    classes,
    definitions,
  } = props;

  return (
    <RenderItem definitions={definitions} classes={classes}>
      {definitions.relays &&
        definitions.relays.map(relay => <RenderItem definitions={relay} classes={classes} />)}
    </RenderItem>
  );
}

Hardware.propTypes = {
  classes: PropTypes.object.isRequired,
  definitions: PropTypes.object.isRequired,
};

export default withStyles(styles)(Hardware);
