import React, {Component} from 'react';
import {render} from 'react-dom';
import { ComposedChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
var moment = require('moment');

//var data = [{name: 'a', value: 12}];
//var data = [{"timestamp":"2018-03-09T21:03:59.329Z","measures":{"temperature1":22.2,"humidity":30.9,"light":1,"temperature2":22.3,"sealevelpressure":1004.93}},{"timestamp":"2018-03-09T21:02:59.494Z","measures":{"temperature1":22.2,"humidity":31.1,"light":1,"temperature2":22.3,"sealevelpressure":1005}},{"timestamp":"2018-03-09T21:02:29.808Z","measures":{"temperature1":22.2,"humidity":31.1,"light":1,"temperature2":22.4,"sealevelpressure":1004.98051649}},{"timestamp":"2018-03-09T20:47:29.637Z","measures":{"temperature1":22.2,"humidity":31.4,"light":1,"temperature2":22.4,"sealevelpressure":1004.83954997}},{"timestamp":"2018-03-09T20:32:29.467Z","measures":{"temperature1":22.2,"humidity":31.2,"light":1,"temperature2":22.4,"sealevelpressure":1004.72879056}},{"timestamp":"2018-03-09T20:17:29.297Z","measures":{"temperature1":22.2,"humidity":31.2,"light":1,"temperature2":22.4,"sealevelpressure":1004.60796212}},{"timestamp":"2018-03-09T20:02:29.126Z","measures":{"temperature1":22.2,"humidity":30.8,"light":3,"temperature2":22.3,"sealevelpressure":1004.63816923}},{"timestamp":"2018-03-09T19:47:28.956Z","measures":{"temperature1":22.2,"humidity":30.6,"light":3,"temperature2":22.3,"sealevelpressure":1004.59789308}},{"timestamp":"2018-03-09T19:32:28.786Z","measures":{"temperature1":22.1,"humidity":28.3,"light":3,"temperature2":22.3,"sealevelpressure":1004.43678849}},{"timestamp":"2018-03-09T19:17:28.616Z","measures":{"temperature1":22,"humidity":26.7,"light":3,"temperature2":22.2,"sealevelpressure":1004.25554582}}];

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
      <YAxis yAxisId="left"/>
      <YAxis yAxisId="right" orientation="right" type="number" domain={[950,1050]}/>
      <Tooltip formatter={this.props.drawTooltip} wrapperStyle={{display: 'none'}} /> 
      <Legend />
      <CartesianGrid stroke="#eee" strokeDasharray="2 2"/>
      <Bar yAxisId="left" name="Light" dataKey="measures.light" barSize={40} fill="#F7B7B4"/> 
      <Line yAxisId="left" name="Temp" type="monotone" dataKey="measures.temperature1" stroke="#8884d8" />
      <Line yAxisId="left" name="Humidity" type="monotone" dataKey="measures.humidity" stroke="#82ca9d" />
      <Line yAxisId="right" name="Pressure" type="monotone" dataKey="measures.sealevelpressure" stroke="#FF0000" />
    </ComposedChart>
    </div>
    )

  }

}

render(<App/>, document.getElementById('app'));
