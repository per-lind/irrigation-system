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
import i18n from '../i18n';
import CheckboxGroup from './CheckboxGroup';

const common = {
  isAnimationActive: false,
  strokeWidth: 2,
  dot: false,
}

const settings = {
  light: {
    component: Bar,
    yAxisId: "light",
    barSize: 30,
    unit: "lx",
    fill: "#825843",
  },
  light_analog: {
    component: Bar,
    yAxisId: "light",
    barSize: 30,
    unit: "lx",
    fill: "#AD9388",
  },
  temperature_BMP085: {
    yAxisId: "temp",
    type: "monotone",
    unit: "ºC",
    stroke: "#292B28",
  },
  temperature_AM2320: {
    yAxisId: "temp",
    type: "monotone",
    dataKey: "measures.temperature1",
    unit: "ºC",
    stroke: "#4d4d51",
  },
  temperature_analog: {
    yAxisId: "temp",
    type: "monotone",
    unit: "ºC",
    stroke: "#8f8f93",
  },
  humidity: {
    yAxisId: "temp",
    type: "monotone",
    unit: "%",
    stroke: "#44758c",
  },
  sealevelpressure: {
    yAxisId: "pressure",
    type: "monotone",
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
      items: ['humidity', 'light_analog', 'sealevelpressure', 'temperature_BMP085']
    }

    this.setRange = this.setRange.bind(this);
    this.dateFormat = this.dateFormat.bind(this);
    this.dateFormatTooltip = this.dateFormatTooltip.bind(this);
    this.getData = this.getData.bind(this);
    this.toggleItem = this.toggleItem.bind(this);
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

  toggleItem(key) {
    let items;
    if (this.state.items.includes(key)) {
      items = this.state.items.filter(item => item !== key)
    } else {
      items = this.state.items.slice();
      items.push(key)
    }
    console.log(items)
    this.setState({ items: items.sort() })
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
            <CartesianGrid stroke="#eee" strokeDasharray="1 1"/>
            {this.state.items.map(item => {
              const attributes = settings[item]
              let GraphComponent = attributes.component || Line
              return <GraphComponent
                {...common}
                {...attributes}
                name={i18n.t('graph.' + item)}
                dataKey={'measures.' + item}
              />
            })}
          </ComposedChart>
        </ResponsiveContainer>
        <CheckboxGroup
          items={settings}
          selected={this.state.items}
          onClick={this.toggleItem}
        />
      </div>
    );
  }
}

export default Observations;
