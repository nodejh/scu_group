import React, { Component } from 'react';
import Subheader from 'material-ui/Subheader';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import App from './../App';
import NewsCard from './../NewsCard';
import './News.css';


const URL_GET_NEWS = '/api/user/news';


class News extends Component {
  constructor(props) {
    super(props);
    this.state = {
      news: [],
      screen: {
        isSmallScreen: true,
        containerStyle: {},
      },
      dialog: {
        open: false,
        text: '',
      },
      userinfo: {
        _id: '',
        number: '',  // 学号
        password: '',  // 教务系统密码
        passwordLib: '',  // 图书馆密码
        name: { show: false, value: '' }, // 姓名
        gender: { show: false, value: '' }, // 性别
        type: { show: false, value: '' }, // 学生类别: 本科
        state: { show: false, value: '' }, // 学籍状态: 在校
        college: { show: false, value: '' }, // 学院
        major: { show: false, value: '' }, // 专业
        grade: { show: false, value: '' }, // 年级
        phone: { show: false, value: '' }, // 电话号码
        wechat: { show: false, value: '' }, // 微信号码
        email: { show: false, value: '', isValidated: false }, // 邮箱
        qq: { show: false, value: '' }, // QQ 号码
        introduction: { show: false, value: '' }, // 个人简介
        projects: { show: false, value: '' }, // 项目经历
        avatar: '', // 头像
        datetime: 0,  // 注册时间
        updatetime: 0,  // 最近更新个人信息时间
        lastLoginTime: 0,  // 最近登录时间
      },
    };
    this.handleScreenInfo = this.handleScreenInfo.bind(this);
    this.getNews = this.getNews.bind(this);
    this.handleGetUserinfo = this.handleGetUserinfo.bind(this);
    this.handleGetUserinfo = this.handleGetUserinfo.bind(this);
    this.handleDialogOpen = this.handleDialogOpen.bind(this);
  }


  componentWillMount() {
    // this.getNews();
  }

  componentDidMount() {
    this.getNews();
  }

  getNews() {
    fetch(URL_GET_NEWS, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then((responseJson) => {
      // console.log('fetch responseJson: ', responseJson);
      if (responseJson.code === 0) {
        const data = responseJson.data;
        this.setState({
          news: data.news,
        });
      } else {
        this.handleDialogOpen(responseJson.message);
      }
    })
    .catch((e) => {
      // console.error(e);
      this.handleDialogOpen(e.message);
    });
  }


  handleScreenInfo(value, style) {
    // console.log('handleScreenInfo: ', value, style);
    const screen = {
      isSmallScreen: value,
      containerStyle: style,
    };
    this.setState({ screen });
  }

  handleGetUserinfo(userinfo) {
    // console.log('handleGetUserinfo: ', userinfo);
    this.setState({
      userinfo,
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


  render() {
    // console.log(this.state);
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
        <App
          title="我的发布"
          cbScreenInfo={this.handleScreenInfo}
          cbGetUserinfo={this.handleGetUserinfo}
        />
        <div style={containerStyle}>
          <Subheader>活动列表</Subheader>
          <div className="root">
            {this.state.news.map(item => (
              <NewsCard
                key={item._id}
                news={item}
                userinfo={this.state.userinfo}
              />
            ))}
          </div>
        </div>
        <Dialog
          actions={actions}
          modal={false}
          open={this.state.dialog.open}
          onRequestClose={this.handleDialogClose}
        >
          {this.state.dialog.text}
        </Dialog>
      </div>
    );
  }
}


export default News;
