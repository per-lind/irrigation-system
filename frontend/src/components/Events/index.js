import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { getEvents } from '../../actions';
import moment from 'moment';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { formatter } from '../../utilities';
import _ from 'lodash';

const styles = theme => ({
  root: {
    width: '100%',
  },
  paper: {
    marginTop: theme.spacing(3),
    width: '100%',
    overflowX: 'auto',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 650,
  },
});

class Events extends Component {
  constructor() {
    super();

    const interval = 3;
    const endTime = moment();
    const startTime = moment().subtract(interval, 'days');

    this.state = {
      visible: [],
      data: [],
      hardware: [],
      selected: [
        'measures.light.light',
        'measures.pressure.pressure',
        'measures.humidity.humidity',
        'measures.humidity.temperature',
      ],
      startTime,
      endTime,
      interval,
    };

  }
  componentDidMount() {
    this.retrieveEvents();
  }

  retrieveEvents = () => {
    const { startTime, endTime } = this.state;
    getEvents({
      startTime: startTime.format(),
      endTime: endTime.format(),
      hardware: ['chip.pump1']
    })
    .then(events => {
      // Flatten data
      const data = _.flatten(events.map(({ timestamp, chip }) =>
        Object.keys(chip).map(relay => ({
          timestamp,
          pump: relay,
          duration: chip[relay].duration,
          success: chip[relay].success,
        }))
      ));
      this.setState({ data })
    })
    .catch(error => {
      console.log('Error retrieving data!')
      console.log(error)
    });
  }

  render() {
    const { classes } = this.props;
    const { data } = this.state;

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Table className={classes.table} size="small">
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>Pump</TableCell>
                <TableCell align="right">Duration (s)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map(row => (
                <TableRow key={row.timestamp}>
                  <TableCell component="th" scope="row">
                    {formatter.longDateTime(row.timestamp)}
                  </TableCell>
                  <TableCell>{row.pump}</TableCell>
                  <TableCell align="right">{row.duration}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(Events);
