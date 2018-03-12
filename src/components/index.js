import React, {Component} from 'react';
import {render} from 'react-dom';
import { ComposedChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
var moment = require('moment');

class App extends Component {

  constructor(){
    super();
    this.state = {graphRangeFilter: 12}

    this.setGraphRange = this.setGraphRange.bind(this);
  }

  setGraphRange(event) {
    this.setState({graphRangeFilter: event.target.id}, () => {
      this.fetchData();
    })
  }

  fetchData() {
    let fromDate = (moment().subtract(this.state.graphRangeFilter, 'hours')).toISOString()
    fetch('/api?fromDate=' + fromDate)
      .then(response => response.json())
      .then(data => this.setState({ hits: data }));
  }

  componentDidMount() {
    this.fetchData()
  }

  dateFormat(tickItem) {
    return moment(tickItem).format('ddd HH:mm')
  }

  render () {

    return (
      <div>
      <ComposedChart width={700} height={500} data={this.state.hits}>
      <XAxis dataKey="timestamp" name="Date" reversed={true} tickFormatter={this.dateFormat}/>
      <YAxis yAxisId="left" type="number" domain={[10,35]}/>
      <YAxis yAxisId="left2"/>
      <YAxis yAxisId="right" orientation="right" type="number" domain={[975,1025]}/>
      <Tooltip formatter={this.props.drawTooltip} /> 
      <Legend />
      <CartesianGrid stroke="#eee" strokeDasharray="1 1"/>
      <Bar yAxisId="left2" name="Light" dataKey="measures.light" barSize={40} fill="#ffcc66"/> 
      <Line yAxisId="left" name="Temp" type="monotone" dataKey="measures.temperature1" stroke="#8884d8" unit="C" dot={false}/>
      <Line yAxisId="left" name="Humidity" type="monotone" dataKey="measures.humidity" legendType="square" stroke="#82ca9d" unit="%" dot={false}/>
      <Line yAxisId="right" name="Pressure" type="monotone" dataKey="measures.sealevelpressure" legendType="cross" stroke="#FF0000" unit="hPa" dot={false}/>
    </ComposedChart>
    <div>
      <button id='24' onClick={this.setGraphRange}>24h</button>
      <button id='72' onClick={this.setGraphRange}>3 days</button>
      <button id='168' onClick={this.setGraphRange}>7 days</button>
    </div>
    </div>
    )

  }

}

render(<App/>, document.getElementById('app'));
