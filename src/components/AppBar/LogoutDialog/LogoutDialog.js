import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';

class LogoutDialog extends React.Component {

  handleCancel = () => {
    this.props.onClose(null);
  };

  handleOk = () => {
    this.props.onClose(this.props.userid);
  };

  render() {

    return (
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="xs"
        aria-labelledby="confirmation-dialog-title"
        {...this.props}
      >

        <DialogTitle id="confirmation-dialog-title">{this.props.userid || ''}</DialogTitle>
        <DialogContent>
          <span>
            로그아웃 하시겠습니까?
          </span>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleOk} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const mapStateToProps = state => ({
  userid: state.currentUser && state.currentUser.loginId
});

export default connect(mapStateToProps)(LogoutDialog);