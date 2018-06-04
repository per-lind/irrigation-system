import React, { Component } from 'react';
import {
  Input,
  FormFeedback,
  FormGroup,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter } from 'reactstrap';
import request from '../utilities/request';
import auth from '../utilities/auth';

class LoginPopup extends Component {
  constructor() {
    super()
    this.state = { password: '', errors: undefined }

    this.handleChange = this.handleChange.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.submit = this.submit.bind(this)
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') this.submit();
  }

  handleChange(event) {
    this.setState({ password: event.target.value, errors: undefined })
  }

  closeDialog() {
    this.setState({ password: undefined, errors: undefined })
    this.props.onClose();
  }

  submit() {
    request({
      url: '/api/login',
      method: 'post',
      data: { username: 'user1', password: this.state.password }
    }).then(response => {
      auth.setToken(response.data.token);
      auth.setUser(response.data.user);
      this.props.loadUser();
      this.closeDialog();
    }).catch(error => {
      this.setState({ errors: 'Login failed' })
    })
  }

  render () {
    return(
      <Modal
        isOpen={this.props.isOpen}
        toggle={this.closeDialog}
        autoFocus={false}
        >
        <ModalHeader toggle={this.closeDialog}>Log in to Irrigation System</ModalHeader>
        <ModalBody>
          <div>
            <FormGroup>
              <Input
                onChange={this.handleChange}
                onKeyPress={this.handleKeyPress}
                type="password"
                placeholder="password"
                invalid={this.state.errors !== undefined}
                autoFocus/>
              <FormFeedback>{this.state.errors}</FormFeedback>
            </FormGroup>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={this.closeDialog} color='link'>Cancel</Button>
          <Button onClick={this.submit} color='primary'>Login</Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default LoginPopup;
