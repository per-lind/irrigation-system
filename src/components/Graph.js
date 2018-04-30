import React, {Component} from 'react';
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area } from 'recharts';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';

import moment from 'moment';
import { withStyles } from 'material-ui/styles';

import yellow from 'material-ui/colors/yellow';
import red from 'material-ui/colors/red';
import blueGrey from 'material-ui/colors/blueGrey';
import green from 'material-ui/colors/green';

const styles = theme => ({
  form: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '10px',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
});

class Graph extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.dateFormat = this.dateFormat.bind(this);
    this.dateFormatTooltip = this.dateFormatTooltip.bind(this);
  }

  dateFormat(tickItem) {
    return moment(tickItem).format('ddd HH:mm');
  }

  dateFormatTooltip(tickItem) {
    return moment(tickItem).format('D MMMM HH:mm');
  }

  handleChange(event) {
    this.props.setRange(event.target.value);
  }

  render () {
    return (
      <div>
        <div className={this.props.classes.form}>
          <FormControl className={this.props.classes.formControl}>
            <InputLabel htmlFor="time-interval">Time interval</InputLabel>
            <Select
              value={this.props.selected}
              onChange={this.handleChange}
              inputProps={{
                id: 'time-interval',
              }}
            >
              {[
                { label: '12h', value: 12 },
                { label: '24h', value: 24 },
                { label: '3 days', value: 72 },
                { label: '7 days', value: 168 },
              ].map(item =>
                <MenuItem value={item.value}>{item.label}</MenuItem>
              )}
            </Select>
          </FormControl>
        </div>
        <ResponsiveContainer width='100%' aspect={5.0/3.0}>
          <ComposedChart data={this.props.data} fontFamily='roboto'>
            <XAxis dataKey="timestamp" name="Date" reversed={true} tickFormatter={this.dateFormat}/>
            <YAxis yAxisId="temp" type="number" domain={[10,35]}/>
            <YAxis yAxisId="light"/>
            <YAxis yAxisId="pressure" orientation="right" type="number" domain={[975,1025]}/>
            <Tooltip labelFormatter={this.dateFormatTooltip} />
            <Legend />
            <CartesianGrid stroke="#eee" strokeDasharray="1 1"/>
            <Area yAxisId="temp" name="Temp" isAnimationActive={false} dataKey="measures.temperature1" fill={blueGrey[100]} stroke={blueGrey[700]} unit="C" dot={false} strokeWidth={1.5} />
            <Bar yAxisId="light" name="Light" isAnimationActive={false} dataKey="measures.light" barSize={30} fill={yellow[700]}/>
            <Line yAxisId="temp" name="Humidity" isAnimationActive={false} type="monotone" dataKey="measures.humidity" legendType="square" stroke={green[700]} unit="%" dot={false} strokeWidth={1.5} />
            <Line yAxisId="pressure" name="Pressure" isAnimationActive={false} type="monotone" dataKey="measures.sealevelpressure" legendType="cross" stroke={red[700]} unit="hPa" dot={false}strokeWidth={1.5} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    )
  }
}

export default withStyles(styles)(Graph);
