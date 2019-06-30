import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import Legend from './Legend'
import RenderTooltip from './Tooltip'
import Filters from './Filters'
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip } from 'recharts';
import _ from 'lodash';
import { formatter } from '../../utilities';
import { context } from '../../utilities';

import {
  amber,
  lightBlue,
  red,
  teal,
  indigo,
  grey,
} from '@material-ui/core/colors';

const styles = {
  graph: {
    overflowX: 'scroll',
    overflowY: 'hidden',
  },
  container: {
    maxWidth: 900,
    minWidth: 600,
    margin: '0 auto',
  }
};

const common = {
  isAnimationActive: false,
  strokeWidth: 2,
  dot: false,
}

const getShade = (count, base=300) => base + (count - 1)*200;

const settings = count => ({
  celsius: {
    yAxisId: "temp",
    type: "monotone",
    formatter: formatter.celsius,
    stroke: red[getShade(count)],
  },
  percent: {
    yAxisId: "temp",
    type: "monotone",
    formatter: formatter.percent,
    stroke: indigo[getShade(count, 100)],
  },
  lux: {
    component: Bar,
    yAxisId: "light",
    barSize: 30,
    formatter: formatter.lux,
    fill: amber[getShade(count)],
  },
  hPa: {
    yAxisId: "pressure",
    type: "monotone",
    formatter: formatter.hPa,
    stroke: teal[getShade(count)],
  },
  cm: {
    component: Bar,
    yAxisId: "light",
    barSize: 30,
    formatter: formatter.cm,
    fill: grey[getShade(count)],
  },
  default: {
    yAxisId: "temp",
    type: "monotone",
    stroke: lightBlue[getShade(count, 500)],
  },
});

class Graph extends Component {
  constructor() {
    super();

    this.state = {
      visible: [],
      data: [],
      hardware: [],
      selected: [],
    };

    this.handleSelect = this.handleSelect.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.retrieveGraphData = this.retrieveGraphData.bind(this);
  }

  componentDidMount() {
    const { defaultInterval } = this.props;
    const interval = defaultInterval || 1;
    const endTime = moment();
    const startTime = moment().subtract(interval, 'days');
    this.setState({
      startTime,
      endTime,
      interval,
    }, () => this.retrieveGraphData());
  }

  retrieveGraphData() {
    const { socket } = this.context;
    const { startTime, endTime } = this.state;
    const { methods } = this.props;
    socket.send('data', { startTime: startTime.format(), endTime: endTime.format(), methods })
      .then(({ data }) => this.setState({ data }))
      .catch(err => console.log(err));
  }

  static getDerivedStateFromProps(props, state) {
    if (props.hardware.length === 0) {
      return null;
    }
    const count = {};
    // Methods that are included in periodic readings
    // Light must be first in the list, otherwise it will cover the other lines...
    const hardware = props.methods.map(id => {
      const sensor = props.hardware.find(h => h.id === id);
      const { response } = sensor;
      return Object.keys(response).map(id => {
        const unit = response[id].unit || 'default';
        count[unit] = _.get(count, unit, 0) + 1;
        return {
          name: `${response[id].name} (${sensor.driver})`,
          dataKey: `measures.${sensor.id}.${id}`,
          ...(settings(count[unit])[unit]),
        }
      })
    })
    const derived = { hardware: _.flatten(hardware) };
    if (state.selected.length === 0) {
      derived.selected = derived.hardware.map(item => item.dataKey);
    }
    return derived;
  }

  handleSelect(id, event) {
    const checked = event.target.checked;
    if (checked) {
      this.setState({ selected: [...this.state.selected, id] });
    } else {
      this.setState({ selected: _.without(this.state.selected, id) });
    }
  }

  handleChange(interval, startTime, endTime) {
    this.setState(
      { interval, startTime, endTime },
      () => this.retrieveGraphData(),
    );
  }

  render() {
    const { hardware, selected, interval, startTime, endTime, data } = this.state;
    const { classes, width } = this.props;

    return (
      <div className={classes.root}>
        <Typography>Last reading: {data[data.length - 1] && formatter.longDateTime(data[data.length - 1].timestamp)}</Typography>
        <Legend
          hardware={hardware}
          selected={selected}
          handleSelect={this.handleSelect}
        />
        <div className={classes.graph}>
          <ResponsiveContainer width='100%' aspect={5.0/3.0} className={classes.container}>
            <ComposedChart
              width={600}
              height={400}
              data={data}
            >
              <XAxis dataKey="timestamp" name="Date" tickFormatter={formatter.shortDateTime}/>
              <YAxis yAxisId="temp" orientation={width === 'xs' ? 'right' : 'left'} tickCount={6}/>
              <YAxis yAxisId="light" orientation="right" />
              <YAxis yAxisId="pressure" orientation="right" domain={[975,1025]}/>
              <Tooltip content={<RenderTooltip />}/>
              <CartesianGrid stroke="#eee" strokeDasharray="3 3"/>
              {hardware.map(item => {
                if (!selected.includes(item.dataKey)) return null;
                let GraphComponent = item.component || Line
                return <GraphComponent
                  key={item.dataKey}
                  {...common}
                  {...item}
                  name={item.name}
                />
              })}
            </ComposedChart>
          </ResponsiveContainer>
          <Filters
            interval={interval}
            startTime={startTime}
            endTime={endTime}
            handleChange={this.handleChange}
          />
        </div>
      </div>
    )
  }
}

Graph.contextType = context;

Graph.propTypes = {
  classes: PropTypes.object.isRequired,
  width: PropTypes.string.isRequired,
};

export default withWidth()(withStyles(styles)(Graph));
