import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import Legend from './Legend'
import RenderTooltip from './Tooltip'
import Filters from './Filters'
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
import { getGraphData } from '../../actions';

import {
  amber,
  lightBlue,
  red,
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

const settings = {
  celsius: {
    yAxisId: "temp",
    type: "monotone",
    formatter: formatter.celsius,
    stroke: red[500],
  },
  percent: {
    yAxisId: "temp",
    type: "monotone",
    formatter: formatter.percent,
    stroke: lightBlue[500],
  },
  lux: {
    component: Bar,
    yAxisId: "light",
    barSize: 30,
    formatter: formatter.lux,
    fill: amber[300],
  },
  default: {
    yAxisId: "temp",
    type: "monotone",
    stroke: lightBlue[500],
  },
};

class Graph extends Component {
  constructor() {
    super();

    const interval = 3;
    const endTime = moment();
    const startTime = moment().subtract(interval, 'days');

    this.state = {
      visible: [],
      data: [],
      hardware: [],
      selected: ['measures.light.light', 'measures.humidity.temperature'],
      startTime,
      endTime,
      interval,
    };

    this.handleSelect = this.handleSelect.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.retrieveGraphData = this.retrieveGraphData.bind(this);
  }

  componentDidMount() {
    this.retrieveGraphData();
  }

  retrieveGraphData() {
    const { startTime, endTime } = this.state;
    getGraphData({ startTime: startTime.format(), endTime: endTime.format() })
      .then(data => this.setState({ data }))
      .catch(error => {
        console.log('Error retrieving data!')
        console.log(error)
      })
  }

  static getDerivedStateFromProps(props, state) {
    if (props.hardware.length === 0) {
      return null;
    }
    // Sensors that are included in periodic readings
    // Light must be first in the list, otherwise it will cover the other lines...
    const sensors = ['light', 'humidity'];
    const hardware = sensors.map(id => {
      const sensor = props.hardware.find(h => h.id === id);
      const { response } = sensor.driver.methods.find(m => m.id === 'read') || [];
      return response.map(item => ({
        name: `${item.name} (${sensor.driver.name})`,
        dataKey: `measures.${sensor.id}.${item.id}`,
        ...(settings[item.unit] || settings.default),
      }))
    })
    return {
      hardware: _.flatten(hardware),
    };
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

Graph.propTypes = {
  classes: PropTypes.object.isRequired,
  width: PropTypes.string.isRequired,
  data: PropTypes.array,
};

export default withWidth()(withStyles(styles)(Graph));
