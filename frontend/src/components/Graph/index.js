import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend } from 'recharts';

import { formatter } from '../../utilities';
import _ from 'lodash';

import {
  amber,
  lightBlue,
  red,
} from '@material-ui/core/colors';

const styles = {
  root: {
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
  light: {
    component: Bar,
    dataKey: 'measures.light.light',
    yAxisId: "light",
    barSize: 30,
    formatter: formatter.lux,
    fill: amber[300],
  },
  temperature: {
    yAxisId: "temp",
    type: "monotone",
    dataKey: "measures.humidity.temperature",
    formatter: formatter.celsius,
    stroke: red[500],
  },
  humidity: {
    yAxisId: "temp",
    type: "monotone",
    dataKey: "measures.humidity.humidity",
    formatter: formatter.percent,
    stroke: lightBlue[500],
  },
};

class Graph extends Component {
  constructor() {
    super();

    this.state = {
      visible: [],
    };
  }

  render() {
    const { classes, data, width } = this.props;

    return (
      <div className={classes.root}>
        <ResponsiveContainer width='100%' aspect={5.0/3.0} className={classes.container}>
          <ComposedChart
            width={600}
            height={400}
            data={data}
          >
            <Legend verticalAlign="top" height={36}/>
            <XAxis dataKey="timestamp" name="Date" reversed={false} tickFormatter={formatter.shortDateTime}/>
            <YAxis yAxisId="temp" orientation={width === 'xs' ? 'right' : 'left'} type="number" domain={[10,35]} tickCount={6}/>
            <YAxis yAxisId="light" orientation="right"/>
            <YAxis yAxisId="pressure" orientation="right" type="number" domain={[975,1025]}/>
            <Tooltip />
            <CartesianGrid stroke="#eee" strokeDasharray="3 3"/>
            {Object.keys(settings).map(item => {
              const attributes = settings[item]
              let GraphComponent = attributes.component || Line
              return <GraphComponent
                key={item}
                {...common}
                {...attributes}
                name={item}
              />
            })}
          </ComposedChart>
        </ResponsiveContainer>
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
