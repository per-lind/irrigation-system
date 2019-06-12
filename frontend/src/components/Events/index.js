import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { formatter } from '../../utilities';
import _ from 'lodash';
import { context } from '../../utilities';

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
    const { socket } = this.context;
    const { startTime, endTime } = this.state;
    socket.send('events', {
      startTime: startTime.format(),
      endTime: endTime.format(),
      hardware: ['chip.pump1']
    });
  }

  render() {
    const { classes } = this.props;
    const { events } = this.context;

    const data = _.flatten(events.map(({ timestamp, events }) => {
      const { chip } = events;
      return Object.keys(chip).map(relay => ({
        timestamp,
        pump: relay,
        duration: chip[relay].duration,
        success: chip[relay].success,
      }))
    }));

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

Events.contextType = context;

export default withStyles(styles)(Events);
