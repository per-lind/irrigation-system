import React, {Component} from 'react';
import {render} from 'react-dom';
import { ComposedChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
var moment = require('moment');

class App extends Component {

  constructor(){
    super();
    this.state = {}
  }

  componentDidMount() {
    fetch('/api')
      .then(response => response.json())
      .then(data => this.setState({ hits: data }));
  }

  dateFormat(tickItem) {
    return moment(tickItem).format('ddd HH:mm')
  }

  render () {

    return (
      <div>
      <p>Mau</p>
      <ComposedChart width={700} height={500} data={this.state.hits}>
      <XAxis dataKey="timestamp" reversed={true} tickFormatter={this.dateFormat}/>
      <YAxis yAxisId="left" type="number" domain={[10,35]}/>
      <YAxis yAxisId="left2"/>
      <YAxis yAxisId="right" orientation="right" type="number" domain={[975,1025]}/>
      <Tooltip formatter={this.props.drawTooltip} wrapperStyle={{display: 'none'}} /> 
      <Legend />
      <CartesianGrid stroke="#eee" strokeDasharray="2 2"/>
      <Bar yAxisId="left2" name="Light" dataKey="measures.light" barSize={40} fill="#F7B7B4"/> 
      <Line yAxisId="left" name="Temp" type="monotone" dataKey="measures.temperature1" stroke="#8884d8" />
      <Line yAxisId="left" name="Humidity" type="monotone" dataKey="measures.humidity" stroke="#82ca9d" />
      <Line yAxisId="right" name="Pressure" type="monotone" dataKey="measures.sealevelpressure" stroke="#FF0000" />
    </ComposedChart>
    </div>
    )

  }

}

render(<App/>, document.getElementById('app'));
