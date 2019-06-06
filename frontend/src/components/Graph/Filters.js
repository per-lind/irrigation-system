import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import moment from 'moment';
import DatePicker from './DatePicker';
import { MuiPickersUtilsProvider } from "material-ui-pickers";
import DateUtils from "@date-io/moment";

const styles = theme => ({
  root: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing(2),
  },
  button: {
    marginLeft: 0,
    marginRight: theme.spacing(2),
  },
  formGroup: {
    marginTop: theme.spacing(1),
  },
  showDate: {
    display: "flex",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
});

function Filters(props) {
  const { classes, interval, startTime, endTime, handleChange } = props;

  return (
    <div className={classes.root}>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Date interval</FormLabel>
        <FormGroup row className={classes.formGroup}>
          {[3, 5, 7].map(i => (
            <Button
              key={i}
              variant={interval === i ? "contained" : "text"}
              size="small"
              className={classes.button}
              onClick={() => handleChange(i, moment().subtract(i, 'days'), moment())}
              color="primary"
            >
              Last {i} days
            </Button>
          ))}
        </FormGroup>
        <div className={classes.showDate}>
          <MuiPickersUtilsProvider utils={DateUtils}>
            <DatePicker
              label="Start time"
              onChange={value => handleChange("custom", value, endTime)}
              value={startTime}
            />
            <DatePicker
              label="End time"
              onChange={value => handleChange("custom", startTime, value)}
              value={endTime}
            />
          </MuiPickersUtilsProvider>
        </div>
      </FormControl>
    </div>
  );
}

Filters.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Filters);
