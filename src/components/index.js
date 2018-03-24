import React, {Component} from 'react';
import {render} from 'react-dom';
import { ComposedChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
var moment = require('moment');

class App extends Component {

  constructor(){
    super();
    this.state = {graphRangeFilter: 12, userName: 0}

    this.setGraphRange = this.setGraphRange.bind(this);
  }

  setGraphRange(event) {
    this.setState({graphRangeFilter: event.target.id}, () => {
      this.fetchData();
    })
  }

  fetchData() {
    let fromDate = (moment().subtract(this.state.graphRangeFilter, 'hours')).toISOString()
    fetch('/api?fromDate=' + fromDate, {
      credentials: "same-origin"
    })
      .then(response => response.json())
      .then(data => this.setState({ hits: data }));
  }

  checkLogin() {
    fetch('/api/checkLogin', {
      credentials: "same-origin"
    })
    .then(response => { return response.json();})
    .then(responseData => {console.log(responseData); return responseData;})
    .then(data => {this.setState({"userName" : data});})
  }

  componentDidMount() {
    this.checkLogin()
    this.fetchData()
  }

  dateFormat(tickItem) {
    return moment(tickItem).format('ddd HH:mm')
  }

  loginForm() {
    if(this.state.userName == 0) {
      return(
      <form action="/login" method="post">
        <input type="text" name="username" value="user1"/>
        <input type="password" name="password"/>
        <input type="submit" value="Submit"/></form>)
    }
    else {
      return(
        <div>
        <a href="/logout">Logout</a><br/>
        <a href="/api/invoke?method=ToggleLED">Toggle LED</a><br/>
        <a href="/api/invoke?method=getDistance">Water level</a><br/>
        </div>
      )
    }
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
      <Bar yAxisId="left2" name="Light" isAnimationActive={false} dataKey="measures.light" barSize={40} fill="#ffcc66"/> 
      <Line yAxisId="left" name="Temp" isAnimationActive={false} type="monotone" dataKey="measures.temperature1" stroke="#8884d8" unit="C" dot={false}/>
      <Line yAxisId="left" name="Humidity" isAnimationActive={false} type="monotone" dataKey="measures.humidity" legendType="square" stroke="#82ca9d" unit="%" dot={false}/>
      <Line yAxisId="right" name="Pressure" isAnimationActive={false} type="monotone" dataKey="measures.sealevelpressure" legendType="cross" stroke="#FF0000" unit="hPa" dot={false}/>
    </ComposedChart>
    <div>
      <button id='24' onClick={this.setGraphRange}>24h</button>
      <button id='72' onClick={this.setGraphRange}>3 days</button>
      <button id='168' onClick={this.setGraphRange}>7 days</button>
    </div>
    <div>
      {this.loginForm()}
    </div>
    </div>
    )

  }

}

render(<App/>, document.getElementById('app'));
