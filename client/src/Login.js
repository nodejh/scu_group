import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { Tabs, Tab } from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import App from './App';


const URL_LOGIN = '/api/login'; // 本科生登录
const URL_LOGIN_POSTGRADUTE = '/api/login_postgraduate'; // 研究生登录
const styles = {
  loginContent: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '50px',
  },
  textWidth: {
    width: '300px',
  },
  button: {
    width: '300px',
    marginTop: '30px',
  },
  loginText: {
    width: '300px',
    padding: '30px',
    backgroundColor: '#fff',
    boxShadow: 'rgba(0, 0, 0, 0.156863) 0px 3px 10px, rgba(0, 0, 0, 0.227451) 0px 3px 10px',
  },
  tips: {
    cursor: 'pointer',
    marginTop: '20px',
    color: '#BDBDBD',
  },
  footer: {
    marginTop: 50,
    marginBottom: 50,
  },
};


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      number: '',
      password: '',
      dialog: {
        open: false,
        text: '出错了...',
      },
      screen: {
        isSmallScreen: true,
        containerStyle: {},
      },
      slideIndex: 0,
    };
    this.onClickButton = this.onClickButton.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleDialogOpen = this.handleDialogOpen.bind(this);
    this.handleScreenInfo = this.handleScreenInfo.bind(this);
    this.checkFormData = this.checkFormData.bind(this);
  }


  /**
   * 模拟登陆
   * @param {string}   type 登录用户类型 本科生／研究生
   * @return {promise} promise
   */
  onClickButton(type) {
    // console.log('type: ', type);
    // return false;
    if (!this.checkFormData()) {
      return false;
    }
    let url = URL_LOGIN;
    switch (type) {
      case 'POSTGRADUTE':
        url = URL_LOGIN_POSTGRADUTE;
        break;
      default:
    }
    const data = {
      number: this.state.number,
      password: this.state.password,
    };
    fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then((responseJson) => {
      // console.log('fetch responseJson: ', responseJson);
      if (responseJson.code === 0 || responseJson.code === 1001) {
        // 登录成功／已经登录
        // 跳转到首页
        browserHistory.push('/');
      } else {
        this.handleDialogOpen(responseJson.message);
      }
    })
    .catch((e) => {
      // console.error(e);
      this.handleDialogOpen(e.message);
    });
  }


  /**
   * 验证表单数据是否正确
   * @return {boolean} bool
   */
  checkFormData() {
    const number = this.state.number;
    const password = this.state.password;
    if (!number) {
      this.handleDialogOpen('请输入您的学号');
      return false;
    }
    if (!/^\d+$/.test(number)) {
      this.handleDialogOpen('学号格式错误');
      return false;
    }
    if (!password) {
      this.handleDialogOpen('请输入您的教务系统密码');
      return false;
    }
    return true;
  }


  handleDialogClose() {
    const dialog = {
      open: false,
      text: '出错了...',
    };
    this.setState({ dialog });
  }


  /**
   * 修改slide
   * @param  {number} value slideindex
   * @return {null}       null
   */
  handleChangeSlide = (value) => {
    this.setState({
      slideIndex: value,
    });
  };


  handleDialogOpen(text) {
    const dialog = {
      open: true,
      text,
    };
    this.setState({ dialog });
  }


  handleScreenInfo(value, style) {
    // console.log('handleScreenInfo: ', value, style);
    const screen = {
      isSmallScreen: value,
      containerStyle: style,
    };
    this.setState({ screen });
  }


  render() {
    // console.log('login this.state: ', this.state.screen);
    const containerStyle = this.state.screen.containerStyle;
    const actions = [
      <FlatButton
        label="确定"
        primary
        onTouchTap={this.handleDialogClose}
      />,
    ];

    return (
      <div>
        <App title="四川大学组队平台" cbScreenInfo={this.handleScreenInfo} />
        <div style={containerStyle}>
          <div style={styles.loginContent}>
            <div style={styles.loginText}>
              <div>
                <Tabs
                  onChange={this.handleChangeSlide}
                  value={this.state.slideIndex}
                  contentContainerStyle={styles.tabs}
                  style={styles.tabs}
                  tabItemContainerStyle={styles.tabs}
                >
                  <Tab label="本科生" value={0} />
                  <Tab label="研究生" value={1} />
                </Tabs>
              </div>

              <SwipeableViews
                index={this.state.slideIndex}
                onChangeIndex={this.handleChangeSlide}
              >
                <div>
                  <TextField
                    style={styles.textWidth}
                    hintText="请输入您的教务系统账号"
                    floatingLabelText="请输入您的教务系统账号"
                    autoComplete="off"
                    type="text"
                    onChange={(event, value) => this.setState({ number: value })}
                    value={this.state.number}
                  />
                  <TextField
                    style={styles.textWidth}
                    hintText="请输入您的教务系统密码"
                    floatingLabelText="请输入您的教务系统密码"
                    type="password"
                    autoComplete="off"
                    onChange={(event, value) => this.setState({ password: value })}
                    value={this.state.password}
                  />
                  <RaisedButton
                    primary
                    style={styles.button}
                    label="登录"
                    onClick={() => this.onClickButton('UNDERGRADUTE')}
                  />
                </div>
                <div>
                  <TextField
                    style={styles.textWidth}
                    hintText="请输入您的校园信息门户用户名"
                    floatingLabelText="请输入您的校园信息门户用户名"
                    autoComplete="off"
                    type="text"
                    onChange={(event, value) => this.setState({ number: value })}
                    value={this.state.number}
                  />
                  <TextField
                    style={styles.textWidth}
                    hintText="请输入您的校园信息门密码"
                    floatingLabelText="请输入您的校园信息门户密码"
                    type="password"
                    autoComplete="off"
                    onChange={(event, value) => this.setState({ password: value })}
                    value={this.state.password}
                  />
                  <RaisedButton
                    primary
                    style={styles.button}
                    label="登录"
                    onClick={() => this.onClickButton('POSTGRADUTE')}
                  />
                </div>
              </SwipeableViews>
            </div>
            <footer style={styles.footer}>
              <span>@四川大学组队平台</span>
              ·「<a target="_blank" rel="noopener noreferrer" href="http://nodejh.com">nodejh</a>」
            </footer>
          </div>
          <Dialog
            actions={actions}
            modal={false}
            open={this.state.dialog.open}
            onRequestClose={this.handleDialogClose}
            contentStyle={{ maxWidth: 500 }}
          >
            {this.state.dialog.text}
          </Dialog>
        </div>
      </div>
    );
  }
}

export default Login;
