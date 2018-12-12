import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  close: {
    padding: theme.spacing.unit / 2,
  },
});

class BrowserSnackbar extends Component {

  state = {
    open: true,
    messageInfo: {},
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;

    const messageInfo = {
      message: 'This is the snackbar. Click here to download Chrome',
      key: new Date().getTime(),
    };

    return <div>
      <Snackbar
        key={messageInfo.key}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={this.state.open}
        onClose={this.handleClose}
        onExited={this.handleExited}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">
          이 페이지는 chrome에 최적화 되어 있습니다.<br/> 
          download를 원하시면, chrome 에서  <a style={{ color: 'red' }} href='https://www.google.com/chrome/' target='_blank'>여기</a>를 click 해주세요.
          </span>}
        action={[
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

