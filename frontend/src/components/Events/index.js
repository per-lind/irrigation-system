import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import Filters from './Filters'
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
  },
});

const events = [
  'run_pump1',
  'run_pump2',
  'run_pump3',
  'run_pump4',
  'read_light',
  'read_humidity',
  'read_pressure',
];

class Events extends Component {
  constructor() {
    super();

    const interval = 3;
    const endTime = moment();
    const startTime = moment().subtract(interval, 'days');

    this.state = {
      selected: [
        'run_pump1',
        'run_pump2',
        'run_pump3',
        'run_pump4',
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
    const { startTime, endTime, selected } = this.state;
    socket.send('events', {
      startTime: startTime.format(),
      endTime: endTime.format(),
      hardware: selected,
    });
  }

  handleChange = values => {
    this.setState(values, () => this.retrieveEvents());
  }

  handleSelect = (id, event) => {
    const checked = event.target.checked;
    let selected;
    if (checked) {
      selected = [...this.state.selected, id];
    } else {
      selected = _.without(this.state.selected, id);
    }
    this.setState({ selected }, () => this.retrieveEvents());
  }

  render() {
    const { classes } = this.props;
    const { irrigation, hardware } = this.context;
    const { startTime, endTime, interval, selected } = this.state;
    const data = _.flatten(irrigation.map(({ timestamp, events }) => {
      const { name } = hardware.find(h => h.id === events.method);
      return {
        timestamp,
        method: `${name} (${events.method})`,
        result: JSON.stringify(events[events.method]),
      }
    }));

    return (
      <div className={classes.root}>
        <Filters
          events={events}
          selected={selected}
          interval={interval}
          startTime={startTime}
          endTime={endTime}
          handleChange={this.handleChange}
          handleSelect={this.handleSelect}
        />
        <Paper className={classes.paper}>
          <Table className={classes.table} size="small">
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>Method</TableCell>
                <TableCell align="right">Result</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map(row => (
                <TableRow key={row.timestamp}>
                  <TableCell component="th" scope="row">
                    {formatter.longDateTime(row.timestamp)}
                  </TableCell>
                  <TableCell>{row.method}</TableCell>
                  <TableCell align="right">{row.result}</TableCell>
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
