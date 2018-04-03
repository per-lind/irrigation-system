import React, {Component} from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
var moment = require('moment');

module.exports = class Graph extends Component {
  constructor(props) {
    super(props);
    this.dateFormat = this.dateFormat.bind(this);
    this.dateFormat = this.dateFormatTooltip.bind(this);
  }
  
  dateFormat(tickItem) {
    return moment(tickItem).format('ddd HH:mm');
  }

  dateFormatTooltip(tickItem) {
    return moment(tickItem).format('D MMMM HH:mm');
  }

  render () {
    return (
      <ComposedChart width={700} height={500} data={this.props.data}>
        <XAxis dataKey="timestamp" name="Date" reversed={true} tickFormatter={this.dateFormat}/>
        <YAxis yAxisId="left" type="number" domain={[10,35]}/>
        <YAxis yAxisId="left2"/>
        <YAxis yAxisId="right" orientation="right" type="number" domain={[975,1025]}/>
        <Tooltip labelFormatter={this.dateFormatTooltip}/> 
        <Legend />
        <CartesianGrid stroke="#eee" strokeDasharray="1 1"/>
        <Bar yAxisId="left2" name="Light" isAnimationActive={false} dataKey="measures.light" barSize={40} fill="#ffcc66"/> 
        <Line yAxisId="left" name="Temp" isAnimationActive={false} type="monotone" dataKey="measures.temperature1" stroke="#8884d8" unit="C" dot={false}/>
        <Line yAxisId="left" name="Humidity" isAnimationActive={false} type="monotone" dataKey="measures.humidity" legendType="square" stroke="#82ca9d" unit="%" dot={false}/>
        <Line yAxisId="right" name="Pressure" isAnimationActive={false} type="monotone" dataKey="measures.sealevelpressure" legendType="cross" stroke="#FF0000" unit="hPa" dot={false}/>
      </ComposedChart>
    )
  }
}
