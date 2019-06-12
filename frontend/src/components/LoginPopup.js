import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { context } from '../utilities';
import { login } from '../actions';

class LoginPopup extends Component {
  state = {
    password: '',
    errors: undefined
  };

  handleKeyPress = event => {
    if (event.key === 'Enter') this.submit();
  };

  handleChange = event => {
    this.setState({ password: event.target.value, errors: undefined })
  };

  handleClose = () => {
    const { closeDialogs } = this.context;
    this.setState({ password: '', errors: undefined })
    closeDialogs();
  };

  submit = () => {
    const { connect } = this.context;
    login({ username: 'user1', password: this.state.password }).then(() => {
      connect();
      this.handleClose();
    })
    .catch(error => {
      this.setState({ errors: 'Login failed' })
    });
  }

  render() {
    const { fullScreen } = this.props;
    const { dialog } = this.context;

    return (
      <div>
        <Dialog
          fullScreen={fullScreen}
          open={dialog === 'login'}
          onClose={() => this.handleClose()}
        >
          <DialogTitle>Log in to Irrigation System</DialogTitle>
          <DialogContent>
            <FormControl fullWidth error={this.state.errors !== undefined} aria-describedby="component-error-text">
              <InputLabel>Password</InputLabel>
              <Input
                onChange={this.handleChange}
                onKeyPress={this.handleKeyPress}
                value={this.state.password}
                error={this.state.errors !== undefined}
                autoFocus
                margin="dense"
                id="password"
                label="Password"
                type="password"
                fullWidth
              />
              <FormHelperText>{this.state.errors}</FormHelperText>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.handleClose()} color="primary">
              Cancel
            </Button>
            <Button onClick={() => this.submit()} color="primary">
              Log in
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

LoginPopup.contextType = context;

LoginPopup.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
};

export default withMobileDialog()(LoginPopup);
