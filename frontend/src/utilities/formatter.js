import moment from 'moment';
import numeral from 'numeral';

const percent = item => `${numeral(item).format('0.00')} %`;

const celsius = item => `${numeral(item).format('0.00')} °C`;

const lux = item => `${numeral(item).format('0.00')} lx`;

const hPa = item => `${numeral(item).format('0.0')} hPa`;

const shortDateTime = item => moment(item).format('ddd D/M HH:mm');

const longDateTime = item => moment(item).format('dddd Y-MM-DD HH:mm');

export default {
  percent,
  celsius,
  lux,
  hPa,
  shortDateTime,
  longDateTime,
};
