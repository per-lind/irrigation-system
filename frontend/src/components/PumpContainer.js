import React, { Component } from 'react';
import Pump from './Pump';
import i18n from '../i18n';

const pumps = [1, 2, 3];

class PumpContainer extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <h3>{i18n.t('headers.pumps')}</h3>
        {pumps.map(pump => <Pump id={pump} {...this.props} />)}
      </div>
    );
  }
}

export default PumpContainer;
