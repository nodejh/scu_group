import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { browserHistory } from 'react-router';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';


const PIXEL = 768;
const URL_IS_LOGIN = '/api/is_login';
const URL_GET_USERINFO = '/api/user/userinfo';
const URL_LOGOUT = '/api/logout';


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      aboutOpen: false, // 关于页面
      drawerOpen: true,
      noEmailOpen: false,
      isSmallScreen: false,
      isLogin: false,
      userinfo: {
        name: { show: true, value: '未登录' },
      },
      dialog: {
        open: false,
        text: '',
      },
    };
    this.reRenderScreen = this.reRenderScreen.bind(this);
    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
    this.handleDrawerChange = this.handleDrawerChange.bind(this);
    this.handleLinkTo = this.handleLinkTo.bind(this);
    this.handleDialogOpen = this.handleDialogOpen.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.isLogin = this.isLogin.bind(this);
    this.getUserinfo = this.getUserinfo.bind(this);
    this.handleNoEmailOpen = this.handleNoEmailOpen.bind(this);
    this.handleDialogEmailClose = this.handleDialogEmailClose.bind(this);
  }


  componentWillMount() {
    this.reRenderScreen();
    this.handleUserState();
  }

  componentDidMount() {
    // this.isLogin();
    window.onresize = () => {
      // console.log('resize...');
      this.reRenderScreen();
    };
  }


  /**
   * 获取当前登录用户的个人信息
   * @return {promise} userinfo 用户个人信息
   */
  getUserinfo() {
    return fetch(URL_GET_USERINFO, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then((responseJson) => {
      // console.log('responseJson: ', responseJson);
      if (responseJson.code === 0) {
        const data = responseJson.data;
        return Promise.resolve(data.userinfo);
      }
      const reason = {
        code: 2,
        message: '获取用户个人信息失败，请刷新重试',
      };
      return Promise.reject(reason);
    })
    .catch((e) => {
      // console.log('e: ', e);
      const reason = {
        code: 2,
        message: '获取用户个人信息失败，请刷新重试',
        e,
      };
      return Promise.reject(reason);
    });
  }


  /**
   * 根据屏幕宽度渲染页面布局
   * @return {null} null
   */
  reRenderScreen() {
    const width = document.documentElement.clientWidth;
    // console.log('reRenderScreen...');
    // console.log('width: ', width);
    if (width <= PIXEL) {
      const data = {
        isSmallScreen: true,
        drawerOpen: false,
      };
      this.setState(data, () => {
        if (this.props.cbScreenInfo) {
          this.props.cbScreenInfo(true, {});
        }
      });
    } else {
      const data = {
        isSmallScreen: false,
        drawerOpen: true,
      };
      this.setState(data, () => {
        if (this.props.cbScreenInfo) {
          this.props.cbScreenInfo(false, { marginLeft: 230, padding: 40 });
        }
      });
    }
  }


  /**
   * 处理用户状态
   * 先判断用户是否登录，若没有则跳转到登录页
   * 然后查询用户信息，更新state中的userinfo
   * @return {null} null
   */
  handleUserState() {
    this.isLogin()
      .then((isLogin) => {
        if (!isLogin) {
          const reason = {
            code: 1,
            message: '您尚未登录，请您先登录',
          };
          return Promise.reject(reason);
        }
        this.setState({
          isLogin: true,
        });
        return this.getUserinfo();
      })
      .then((userinfo) => {
        this.setState({
          userinfo,
        }, () => {
          if (this.props.cbGetUserinfo) {
            this.props.cbGetUserinfo(userinfo);
          }
        });
      })
      .catch((e) => {
        if (e.code === 1) {
          return browserHistory.push('/login');
        }
        this.handleDialogOpen(e.message);
      });
  }


  handleDrawerToggle() {
    this.setState({ drawerOpen: !this.state.drawerOpen });
  }


  handleDrawerChange(open, reason) {
    // console.log(open, reason);
    if (open === false && reason) {
      this.setState({ drawerOpen: false });
    }
  }


  /**
   * router跳转
   * 小屏幕，先关闭drawer再跳转
   * 大屏幕，直接跳转
   * @param {string} link 跳转的链接
   * @return {null} null
   */
  handleLinkTo(link) {
    // 如果是跳转到发布活动页面，先判断用户邮箱是否填写
    // console.log('link: ', link);
    if (link === '/user/publish') {
      const userinfo = this.state.userinfo;
      // 先完善个人信息再发布活动
      if (!userinfo.email.value) {
        // return this.handleDialogOpen('请先进入个人中心填写并验证邮箱后再发布活动');
        return this.handleNoEmailOpen();
      }
      if (!userinfo.email.isValidated) {
        // return this.handleDialogOpen('请先进入个人中心填写并验证邮箱后再发布活动');
        return this.handleNoEmailOpen();
      }
      // if (!(userinfo.email.value && userinfo.introduction.value && userinfo.projects.value)) {
      //   this.handleDialogOpen('请先进入个人中心先完善个人信息再发布活动');
      // }
    }
    if (this.state.isSmallScreen) {
      this.setState({
        drawerOpen: false,
      }, () => {
        browserHistory.push(link);
      });
    } else {
      browserHistory.push(link);
    }
  }


  /**
   * 打开请先验证邮箱的dialog
   * @return {null} null
   */
  handleNoEmailOpen() {
    this.setState({
      noEmailOpen: true,
    });
  }

  /**
   * 关闭邮箱验证的dialog
   * @return {null} null
   */
  handleDialogEmailClose() {
    this.setState({
      noEmailOpen: false,
    }, () => {
      browserHistory.push('/user/userinfo');
    });
  }

  handleLogout() {
    return fetch(URL_LOGOUT, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then((result) => {
      // console.log('result: ', result);
      if (result.code === 0) {
        browserHistory.push('/login');
      } else {
        this.handleDialogOpen('退出登录失败');
      }
    })
    .catch(() => {
      // console.error('e: ', e);
      this.handleDialogOpen('退出登录失败');
    });
  }


  handleDialogOpen = (text) => {
    const dialog = {
      text,
      open: true,
    };
    this.setState({ dialog });
  }


  handleDialogClose = () => {
    const dialog = {
      open: false,
    };
    this.setState({ dialog });
  }


  /**
   * 判断用户是否登录
   * @return {promise} true/false 是否登录
   */
  isLogin() {
    return fetch(URL_IS_LOGIN, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then((responseJson) => {
      // console.log('responseJson: ', responseJson);
      if (responseJson.code === 0) {
        const data = responseJson.data;
        return Promise.resolve(data.isLogin);
      }
      return Promise.reject({ code: 1, message: '获取登录状态失败，请刷新重试' });
      // this.handleDialogOpen('获取登录状态失败，请刷新重试');
    })
    .catch((e) => {
      // console.log('e: ', e);
      const reason = { code: 2, message: '获取登录状态失败，请刷新重试', e };
      return Promise.reject(reason);
    });
  }


  render() {
    // console.log('this props: ', this.props);
    const userinfo = this.state.userinfo;
    const title = this.props.title ? this.props.title : '四川大学组队平台';
    // 小屏幕，则文字挨着icon；大屏幕，则文字与icon有160px间距
    const titleStyle = this.state.isSmallScreen ? {} : { marginLeft: 230 };
    const actions = [
      <FlatButton
        label="确定"
        primary
        onTouchTap={this.handleDialogClose}
      />,
    ];
    const actionsNoEmail = [
      <FlatButton
        label="确定"
        primary
        onTouchTap={() => this.handleDialogEmailClose()}
      />,
    ];
    return (
      <MuiThemeProvider>
        <div>
          <AppBar
            title={title}
            onLeftIconButtonTouchTap={this.handleDrawerToggle}
            titleStyle={titleStyle}
            iconElementRight={
              <IconMenu
                iconButtonElement={
                  <IconButton><MoreVertIcon /></IconButton>
                }
                targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
              >
                <MenuItem
                  primaryText="关于"
                  onClick={() => this.handleDialogOpen('目前处于内测阶段，功能和BUG反馈请联系：571963318(QQ)')}
                />
                {!this.state.isLogin &&
                  <MenuItem primaryText="登陆" onClick={() => this.handleLinkTo('/login/')} />
                }
                {this.state.isLogin &&
                  <MenuItem primaryText="退出" onClick={() => this.handleLogout()} />
                }
              </IconMenu>
            }
          />
          <Drawer
            open={this.state.drawerOpen}
            width={250}
            // 小屏幕，docked={false}；大屏幕，docked={true}
            docked={!this.state.isSmallScreen}
            swipeAreaWidth={30}
            onRequestChange={this.handleDrawerChange}
          >
            <AppBar
              title={userinfo.name.value}
              showMenuIconButton={false}
            />
            <MenuItem onClick={() => this.handleLinkTo('/')}>所有活动</MenuItem>
            <MenuItem onClick={() => this.handleLinkTo('/user/publish')}>发布活动</MenuItem>
            <MenuItem onClick={() => this.handleLinkTo('/user/joined_list')}>我的参与</MenuItem>
            <MenuItem onClick={() => this.handleLinkTo('/user/news')}>我的发布</MenuItem>
            <MenuItem onClick={() => this.handleLinkTo('/user/userinfo')}>个人中心</MenuItem>
          </Drawer>

          <Dialog
            actions={actions}
            modal={false}
            open={this.state.dialog.open}
            onRequestClose={this.handleDialogClose}
          >
            {this.state.dialog.text}
          </Dialog>

          <Dialog
            title=""
            actions={actionsNoEmail}
            modal={false}
            open={this.state.noEmailOpen}
            onRequestClose={() => this.handleDialogEmailClose()}
          >
            请先进入个人中心填写并验证邮箱后再发布活动
          </Dialog>

        </div>
      </MuiThemeProvider>
    );
  }
}


App.propTypes = {
  title: React.PropTypes.string,
  cbGetUserinfo: React.PropTypes.func,
  cbScreenInfo: React.PropTypes.func,
};

export default App;
