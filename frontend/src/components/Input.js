import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const styles = {
  root: {
    overflow: 'scroll',
  },
};

function Input(props) {
  const {
    classes,
    id,
    label,
    required,
    type,
    min,
    max,
    onChange,
    value,
  } = props;

  let item;

  switch(type) {
    case 'integer':
      item = (
        <TextField
          id={id}
          label={label}
          value={value || ''}
          onChange={event => onChange(id, event.target.value)}
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
        />
      )
      break;
    default:
      return <div>Failed to render input</div>;
  }

  return (
    <div className={classes.root}>
      {item}
    </div>
  );
}

Input.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Input);
