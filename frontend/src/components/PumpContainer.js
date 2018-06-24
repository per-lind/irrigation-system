import React, { Component } from 'react';
import { Button, Input, FormGroup, Label } from 'reactstrap';
import request from '../utilities/request';
import i18n from '../i18n';

const durations = [10, 20, 30];

const pumps = [1, 2, 3];

class PumpContainer extends Component {
  constructor() {
    super();

    this.state = {
      history: [],
      duration: durations[0],
      loading: false,
      errors: undefined,
    }

    this.changeDuration = this.changeDuration.bind(this);
    this.invokeFunction = this.invokeFunction.bind(this);
  }

  changeDuration(duration) {
    this.setState({duration: duration})
  }

  invokeFunction(pumpId) {
    if (!this.props.user) return this.props.openLoginPopup();
    this.setState({ loading: true, errors: false });
    request({
      url: '/api/pump/' + pumpId,
      params: { method: this.props.method, duration: this.state.duration }
    }).then(response => {
      let history = this.state.history.slice();
      history.unshift({message: `Successfully ran pump ${pumpId} for ${this.state.duration} seconds.`, success: true})
      this.setState({
        history: history,
        loading: false,
      });
    }).catch(error => {
      let history = this.state.history.slice();
      history.unshift({message: `Failed to run pump ${pumpId}.`, success: false})

      this.setState({
        history: history,
        loading: false,
      })
    })
  }

  render() {
    return (
      <div className="row pump-container">
        <div className="col-xs-12 col-sm-6">
          <Label>Duration (seconds):</Label>
          <div className='radio-buttons'>
            {durations.map(duration =>
              <FormGroup check inline>
                <Input
                  type="radio"
                  checked={this.state.duration === duration}
                  onClick={() => this.changeDuration(duration)}
                  />{' '}{duration}
              </FormGroup>
            )}
          </div>
          {pumps.map(pump => {
            return (
              <Button
                color="primary"
                onClick={() => this.invokeFunction(pump)}
                disabled={this.state.loading}
                block
                >
                {i18n.t('actions.button.startPump' + pump, {duration: this.state.duration})}
              </Button>
            )
          })}
        </div>
        <div className="col-xs-12 col-sm-6">
          {this.state.loading && <div>In progress...</div>}
          {this.state.history.map(item => <div className={item.success ? "text-info" : "text-danger"}>{item.message}</div>)}
        </div>
      </div>
    );
  }
}

export default PumpContainer;
