import moment from 'moment';
import numeral from 'numeral';

const percent = item => `${numeral(item).format('0.00')} %`;

const celsius = item => `${numeral(item).format('0.00')} °C`;

const lux = item => `${numeral(item).format('0.00')} lx`;

const shortDateTime = item => moment(item).format('ddd Do MMM HH:mm');

export default {
  percent,
  celsius,
  lux,
  shortDateTime,
};
