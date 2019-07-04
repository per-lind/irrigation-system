import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import moment from 'moment';
import DatePicker from '../DatePicker';
import { MuiPickersUtilsProvider } from "material-ui-pickers";
import DateUtils from "@date-io/moment";

const useStyles = makeStyles(theme => ({
  root: {
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
}));

function Filters(props) {
  const classes = useStyles();
  const { interval, startTime, endTime, handleChange, events, selected, handleSelect } = props;

  return (
    <div className={classes.root}>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Display</FormLabel>
        <FormGroup row>
          {events.map(item => (
            <FormControlLabel
              key={item}
              control={
                <Checkbox
                  classes={{ root: classes.checkboxRoot }}
                  checked={selected.includes(item)}
                  onChange={e => handleSelect(item, e)}
                  value={item}
                />
              }
              label={item}
            />
          ))}
        </FormGroup>
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Date interval</FormLabel>
        <FormGroup row className={classes.formGroup}>
          {[1, 3, 7].map(i => (
            <Button
              key={i}
              variant={interval === i ? "contained" : "text"}
              size="small"
              className={classes.button}
              onClick={() => handleChange({
                interval: i,
                startTime: moment().subtract(i, 'days'),
                endTime: moment(),
              })}
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
              onChange={value => handleChange({
                interval: "custom",
                startTime: value,
                endTime,
              })}
              value={startTime}
            />
            <DatePicker
              label="End time"
              onChange={value => handleChange({
                interval: "custom",
                startTime,
                endTime: value,
              })}
              value={endTime}
            />
          </MuiPickersUtilsProvider>
        </div>
      </FormControl>
    </div>
  );
}

export default Filters;
