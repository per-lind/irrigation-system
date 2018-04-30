import React, {Component} from 'react';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

module.exports = class LoginPopup extends Component {
  constructor() {
    super()
    this.state = { password: '' }

    this.handleChange = this.handleChange.bind(this)
    this.submit = this.submit.bind(this)
  }

  handleChange(event) {
    this.setState({ password: event.target.value })
  }

  submit() {
    this.props.login(this.state.password)
  }

  render () {
    return(
      <Dialog
        open={this.props.open}
        onClose={this.props.close}
        aria-labelledby="alert-dialog-tsitle"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth = {'xs'}
        >
        <DialogContent>
          <div>
            <TextField onChange={this.handleChange} type="password" label="Password" fullWidth autoFocus />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.close}>Cancel</Button>
          <Button onClick={this.submit} color="primary">Login</Button>
        </DialogActions>
      </Dialog>
    );
  }
}
