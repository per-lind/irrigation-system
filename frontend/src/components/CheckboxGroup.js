import React, { Component } from 'react';
import { FormGroup, Label, CustomInput } from 'reactstrap';
import i18n from '../i18n';

class CheckboxGroup extends Component {
  render() {
    return (
      <FormGroup>
        <div className='row'>
          {Object.keys(this.props.items).map(key => {
            let attributes = this.props.items[key]
            let style = {}
            let color = attributes.stroke || attributes.fill
            if (this.props.selected.includes(key)) {
              style = {
                color: color,
              }
            } else {
              style = {
                color: '#eeeeee',
              }
            }
            return (
              <div className="col-xs-12 col-sm-6 col-md-4 col-xl-3" style={style}>
                <CustomInput
                  type="checkbox"
                  id={'checkbox-' + key}
                  label={i18n.t('graph.' + key)}
                  checked={this.props.selected.includes(key)}
                  onChange={() => this.props.onClick(key)}
                  />
              </div>
            )
          })}
        </div>
      </FormGroup>
    )
  }
}

export default CheckboxGroup;
