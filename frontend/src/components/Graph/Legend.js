import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const styles = theme => ({
  root: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing.unit * 2,
  },
  checkboxRoot: {
    paddingTop: 3,
    paddingBottom: 3,
  },
});

const iconStyle = color => ({
  color,
  '&$checked': {
    color,
  }
});

function Legend(props) {
  const { classes, handleSelect, hardware, selected } = props;
  return (
    <div className={classes.root}>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Display</FormLabel>
        <FormGroup row>
          {hardware.map(item => (
            <FormControlLabel
              key={item.dataKey}
              control={
                <Checkbox
                  classes={{ root: classes.checkboxRoot }}
                  checked={selected.includes(item.dataKey)}
                  onChange={e => handleSelect(item.dataKey, e)}
                  value={item.dataKey}
                  style={iconStyle(item.stroke || item.fill)}
                />
              }
              label={item.name}
            />
          ))}
        </FormGroup>
      </FormControl>
    </div>
  );
}

Legend.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Legend);
