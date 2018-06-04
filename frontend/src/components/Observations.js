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
  Tooltip, Legend,
  Area } from 'recharts';
import moment from 'moment';
import request from '../utilities/request'

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
        <ButtonGroup>
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
            <Tooltip labelFormatter={this.dateFormatTooltip} />
            <Legend />
            <CartesianGrid stroke="#eee" strokeDasharray="1 1"/>
            <Area yAxisId="temp" name="Temp" isAnimationActive={false} dataKey="measures.temperature1" unit="C" dot={false} strokeWidth={1.5} />
            <Bar yAxisId="light" name="Light" isAnimationActive={false} dataKey="measures.light" barSize={30} />
            <Line yAxisId="temp" name="Humidity" isAnimationActive={false} type="monotone" dataKey="measures.humidity" legendType="square" unit="%" dot={false} strokeWidth={1.5} />
            <Line yAxisId="pressure" name="Pressure" isAnimationActive={false} type="monotone" dataKey="measures.sealevelpressure" legendType="cross" unit="hPa" dot={false} strokeWidth={1.5} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default Observations;
