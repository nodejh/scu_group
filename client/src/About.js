import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';


class About extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      open: this.props.open,
    };
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const actions = [
      <FlatButton
        label="确定"
        primary
        onTouchTap={this.handleClose}
      />,
    ];
    return (
      <div>
        <RaisedButton label="Dialog" onTouchTap={this.handleOpen} />
        <Dialog
          title="关于"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <h3>四川大学组队平台</h3>
          <p>
            BUG反馈：571963318(QQ)
          </p>
        </Dialog>
      </div>
    );
  }
}


About.propTypes = {
  open: React.PropTypes.bool,
};

export default About;
