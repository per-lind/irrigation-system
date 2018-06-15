import React, { Component } from 'react';
import { Button, ButtonGroup } from 'reactstrap';
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
import moment from 'moment';
import request from '../utilities/request'

const common = {
  isAnimationActive: false,
  strokeWidth: 2,
  dot: false,
}

const settings = {
  light: {
    yAxisId: "light",
    name: "Light",
    dataKey: "measures.light",
    barSize: 30,
    unit: "lx",
    fill: "#AD9388",
  },
  temp: {
    yAxisId: "temp",
    name: "Temp",
    type: "monotone",
    dataKey: "measures.temperature1",
    unit: "ºC",
    stroke: "#292B28",
  },
  humidity: {
    yAxisId: "temp",
    name: "Humidity",
    type: "monotone",
    dataKey: "measures.humidity",
    unit: "%",
    stroke: "#44758c",
  },
  pressure: {
    yAxisId: "pressure",
    name: "Pressure",
    type: "monotone",
    dataKey: "measures.sealevelpressure",
    unit: "hPa",
    stroke: "#ADC948",
  }
}

const renderTooltip = props => {
  const { label, labelFormatter, payload } = props;
  return (
    <div className='tooltip-graph'>
      <div className='tooltip-graph-title'>{labelFormatter(label)}</div>
      <div className='tooltip-graph-inner'>
        {payload && payload.map(item =>
          <div style={{ color: item.color }}><strong>{item.name}:</strong> {item.value} {item.unit}</div>
        )}
      </div>
    </div>
  );
}

class Observations extends Component {
  constructor() {
    super();
    this.state = {
      range: 12,
      data: [],
    }

    this.setRange = this.setRange.bind(this);
    this.dateFormat = this.dateFormat.bind(this);
    this.dateFormatTooltip = this.dateFormatTooltip.bind(this);
    this.getData = this.getData.bind(this);
  }

  getData() {
    let fromDate = (moment().subtract(this.state.range, 'hours')).toISOString();

    request({
      url: '/api/data',
      params: { fromDate: fromDate }
    }).then(response => {
      this.setState({ data: response.data.data });
    });
  }

  dateFormat(tickItem) {
    return moment(tickItem).format('ddd HH:mm');
  }

  dateFormatTooltip(tickItem) {
    return moment(tickItem).format('D MMMM HH:mm');
  }

  setRange(range) {
    this.setState({ range: range }, () => this.getData());
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    return (
      <div>
        <ButtonGroup className='btn-group-block'>
          {[
            { label: '12h', value: 12 },
            { label: '24h', value: 24 },
            { label: '3 days', value: 72 },
            { label: '7 days', value: 168 },
          ].map(item =>
            <Button
              color={this.state.range === item.value ? 'primary' : 'link'}
              key={item.value}
              value={item.value}
              onClick={() => this.setRange(item.value)}
              >{item.label}</Button>
          )}
        </ButtonGroup>
        <ResponsiveContainer width='100%' aspect={5.0/3.0}>
          <ComposedChart width={600} height={400} data={this.state.data}>
            <XAxis dataKey="timestamp" name="Date" reversed={true} tickFormatter={this.dateFormat}/>
            <YAxis yAxisId="temp" type="number" domain={[10,35]}/>
            <YAxis yAxisId="light"/>
            <YAxis yAxisId="pressure" orientation="right" type="number" domain={[975,1025]}/>
            <Tooltip labelFormatter={this.dateFormatTooltip} content={renderTooltip} />
            <Legend />
            <CartesianGrid stroke="#eee" strokeDasharray="1 1"/>
            <Bar {...common} {...settings.light} />
            <Line {...common} {...settings.temp} />
            <Line {...common} {...settings.humidity} />
            <Line {...common} {...settings.pressure} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default Observations;
