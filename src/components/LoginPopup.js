import React, {Component} from 'react';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
  } from 'material-ui/Dialog';
import Input from 'material-ui/Input';
import Button from 'material-ui/Button';

module.exports = class TopMenu extends Component {
    render () {
      return(
        <Dialog
        open={this.props.open}
        onClose={this.props.close}
        aria-labelledby="alert-dialog-tsitle"
        aria-describedby="alert-dialog-description"
        >
        <DialogTitle id="alert-dialog-title">{"Login"}</DialogTitle>
        <DialogContent>
        <div>
          <form action="/login" method="post">
            <input type="hidden" name="username" defaultValue="user1"/>
            <Input type="password" name="password" autoFocus/>
            <Button type="submit" value="Submit" onClick={this.props.close} color="primary">Login</Button>
          </form>
        </div>
        </DialogContent>
        <DialogActions>
            <Button onClick={this.props.close}>
            Cancel
            </Button>
        </DialogActions>
        </Dialog>
      );
    }
}