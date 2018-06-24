import React, { Component } from 'react';
import { Button } from 'reactstrap';
import request from '../utilities/request';
import i18n from '../i18n';

class Action extends Component {
  constructor() {
    super();

    this.state = {
      value: undefined,
      loading: false,
      errors: undefined,
    };

    this.invokeFunction = this.invokeFunction.bind(this);
  }

  invokeFunction() {
    if (!this.props.user) return this.props.openLoginPopup();
    this.setState({ loading: true, errors: false });
    request({
      url: '/api/invoke',
      params: { method: this.props.method }
    }).then(response => {
      this.setState({
        value: response.data.Response[this.props.dataKey],
        loading: false,
      });
    }).catch(error => {
      this.setState({
        errors: 'Failed to invoke function',
        loading: false,
      })
    })
  }

  render() {
    return (
      <div>
        <Button
          color='primary'
          onClick={this.invokeFunction}
          disabled={this.state.loading}
          >
          {i18n.t('actions.button.' + this.props.method)}
        </Button>
        {this.state.loading && <div>Loading...</div>}
        {this.state.errors && <div className='text-danger'>{this.state.errors}</div>}
        {this.state.value && <div>{i18n.t('actions.result.' + this.props.method)}: {this.state.value}</div>}
      </div>
    );
  }
}

export default Action;
