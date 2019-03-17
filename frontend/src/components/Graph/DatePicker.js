import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { InlineDateTimePicker } from "material-ui-pickers";

const styles = theme => ({
  picker: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
});

function DatePicker(props) {
  const { label, value, onChange, classes } = props;

  return (
    <div className={classes.picker}>
      <InlineDateTimePicker
        keyboard
        disableFuture
        ampm={false}
        label={label}
        value={value}
        onChange={onChange}
        clearable={false}
        format={"YYYY/MM/DD H:mm"}
        mask={[/\d/, /\d/, /\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, " ", /\d/, /\d/, ":", /\d/, /\d/]}
      />
    </div>
  );
};

DatePicker.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DatePicker);
