import React, { Component } from 'react';
import { ButtonGroup, Button } from 'reactstrap';
import request from '../utilities/request';
import i18n from '../i18n';

const durations = [10, 20, 30];

class Pump extends Component {
  constructor() {
    super();

    this.state = {
      value: undefined,
      selected: undefined,
      loading: false,
      errors: undefined,
    };

    this.invokeFunction = this.invokeFunction.bind(this);
  }

  invokeFunction(duration) {
    if (!this.props.user) return this.props.openLoginPopup();
    this.setState({ loading: true, errors: false, selected: duration });
    request({
      url: '/api/pump/' + this.props.id,
      params: { method: this.props.method, duration: duration }
    }).then(response => {
      this.setState({
        value: true,
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
    const { id } = this.props;

    return (
      <div>
        <h4>{i18n.t('methods.StartPump' + id)}</h4>
        <ButtonGroup className='btn-group-block'>
          {durations.map(duration =>
            <Button
              color={this.state.selected === duration ? 'primary' : 'link'}
              onClick={() => this.invokeFunction(duration)}
              disabled={this.state.loading}
              >
              {duration}
            </Button>
          )}
        </ButtonGroup>
        {this.state.loading && <div>Loading...</div>}
        {this.state.errors && <div className='text-danger'>{this.state.errors}</div>}
        {this.state.value && <div>{i18n.t('actions.result.StartPump' + id)}: {this.state.value}</div>}
      </div>
    );
  }
}

export default Pump;
