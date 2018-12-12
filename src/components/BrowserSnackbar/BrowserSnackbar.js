import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@material-ui/core/Snackbar';
import { IconButton } from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

const styles = theme => ({
  close: {
    padding: theme.spacing.unit / 2,
  },
});

class BrowserSnackbar extends Component {

  state = {
    open: false,
    messageInfo: {},
  };

  handleClick = message => () => {
    if (this.state.open) {
      // immediately begin dismissing current message
      // to start showing new one
      this.setState({ open: false });
    } else {
      this.processQueue();
    }
  };

  render() {
    const { classes } = this.props;

    const messageInfo = {
      message: 'This is the snackbar',
      key: new Date().getTime(),
    };

    return <div>
        <Snackbar
          key={messageInfo.key}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={true}
          onClose={this.handleClose}
          onExited={this.handleExited}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{messageInfo.message}</span>}
          action={[
            <Button key="undo" color="secondary" size="small" onClick={this.handleClose}>
              UNDO
            </Button>,
            <IconButton
              key="close"
              aria-label="Close"
              className={classes.close}
              color="inherit"
              onClick={this.handleClose}>
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </div>
  }
}

BrowserSnackbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BrowserSnackbar);

