import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import FlatButton from 'material-ui/FlatButton';
import App from './../App';
import ImageUpload from './ImageUpload';
import './Userinfo.css';


// 更新某一项
const URL_USERINFO_UPDATE_ONE = '/api/user/userinfo/update_one';
// 更新全部
const URL_USERINFO_UPDATE = '/api/user/userinfo/update';
const styles = {
  toggle: {
    marginBottom: 16,
  },
  thumbOff: {
    backgroundColor: '#ffcccc',
  },
  trackOff: {
    backgroundColor: '#ff9d9d',
  },
  thumbSwitched: {
    backgroundColor: 'red',
  },
  trackSwitched: {
    backgroundColor: '#ff9d9d',
  },
  labelStyle: {
    color: 'red',
  },
  hideInfo: {
    color: '#bdbdbd',
  },
};


class Userinfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    this.handleGetUserinfo = this.handleGetUserinfo.bind(this);
    this.onToggle = this.onToggle.bind(this);
    this.updateUserinfoOne = this.updateUserinfoOne.bind(this);
    this.handleDialogOpen = this.handleDialogOpen.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.updateUserinfo = this.updateUserinfo.bind(this);
  }


  componentWillMount() {
    // console.log('componentWillMount', this.refs.app);
  }

  componentDidMount() {
    // this.app.getUserinfo();
  }


  onToggle(key) {
    // console.log('key: ', key);
    const userinfo = this.state.userinfo;
    // console.log('userinfo: ', userinfo);
    userinfo[key].show = !userinfo[key].show;
    // console.log('userinfo: ', userinfo);
    this.setState({ userinfo }, () => {
      this.updateUserinfoOne(key);
    });
  }


  handleGetUserinfo(userinfo) {
    // console.log('handleGetUserinfo: ', userinfo);
    this.setState({
      userinfo,
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


  handleDialogClose() {
    const dialog = {
      open: false,
      text: '出错了...',
    };
    this.setState({ dialog });
  }


  handleDialogOpen(text) {
    const dialog = {
      open: true,
      text,
    };
    this.setState({ dialog });
  }


  handleChange(value, key) {
    // console.log('cccc');
    // console.log(value, key);
    const userinfo = this.state.userinfo;
    userinfo[key].value = value;
    // console.log(userinfo);
    this.setState({ userinfo });
  }


  handleSave() {
    const userinfo = this.state.userinfo;
    // console.log('userinfo: ', userinfo);
    this.updateUserinfo(userinfo);
  }


  /**
   * 更新只能修改可见性的属性值
   * @param {string} key 属性名称
   * @return {null} null
   */
  updateUserinfoOne(key) {
    const data = {};
    data[key] = this.state.userinfo[key];
    fetch(URL_USERINFO_UPDATE_ONE, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data, key }),
    })
    .then(response => response.json())
    .then((responseJson) => {
      // console.log(responseJson);
      if (responseJson.code === 0) {
        return true;
      }
      const str = `更新${key}失败，${responseJson.message}，请重试`;
      return this.handleDialogOpen(str);
    })
    .catch((e) => {
      const str = `更新${key}失败，${e.message}，请重试`;
      return this.handleDialogOpen(str);
    });
  }


  /**
   * 更新全部用户信息
   * @param {object} data 用户信息
   * @return {null} null
   */
  updateUserinfo(data) {
    fetch(URL_USERINFO_UPDATE, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    })
    .then(response => response.json())
    .then((responseJson) => {
      // console.log(responseJson);
      if (responseJson.code === 0) {
        if (responseJson.sendMail) {
          const str = '为了让别人更好地联系到您，我们给您的邮箱发送了一封验证邮件，请及时进入邮箱点击链接进行验证！';
          return this.handleDialogOpen(str);
        }
        const str = '更新个人信息成功！';
        return this.handleDialogOpen(str);
      }
      const str = '更新个人信息失败，请重试';
      return this.handleDialogOpen(str);
    })
    .catch((e) => {
      const str = `更新个人信息失败：${e.message}，请重试`;
      return this.handleDialogOpen(str);
    });
  }

  render() {
    const containerStyle = this.state.screen.containerStyle;
    const userinfo = this.state.userinfo;
    const actions = [
      <FlatButton
        label="确定"
        primary
        onTouchTap={this.handleDialogClose}
      />,
    ];
    // console.log('userinfo: ', userinfo);
    return (
      <div>
        <App
          title="个人信息"
          cbScreenInfo={this.handleScreenInfo}
          cbGetUserinfo={this.handleGetUserinfo}
        />

        <div style={containerStyle}>
          <div className="content">
            <Paper zDepth={1} rounded={false} className="paper">
              <div className="infoLeft">
                <ImageUpload avatar={userinfo.avatar} />
              </div>
              <div className="infoRight">
                <h4>您可以选择显示或隐藏个人信息</h4>
                <Toggle
                  label={`姓名：${userinfo.name.value}`}
                  toggled={Boolean(userinfo.name.show)}
                  style={styles.toggle}
                  labelStyle={userinfo.name.show ? {} : styles.hideInfo}
                  onToggle={() => { this.onToggle('name'); }}
                />
                <Toggle
                  label={`性别：${userinfo.gender.value}`}
                  toggled={Boolean(userinfo.gender.show)}
                  style={styles.toggle}
                  onToggle={() => { this.onToggle('gender'); }}
                  labelStyle={userinfo.gender.show ? {} : styles.hideInfo}
                />
                <Toggle
                  label={`年级：${userinfo.grade.value}`}
                  defaultToggled={userinfo.grade.show}
                  style={styles.toggle}
                  onToggle={() => { this.onToggle('grade'); }}
                  labelStyle={userinfo.grade.show ? {} : styles.hideInfo}
                />
                <Toggle
                  label={`学院：${userinfo.college.value}`}
                  toggled={Boolean(userinfo.college.show)}
                  style={styles.toggle}
                  onToggle={() => { this.onToggle('college'); }}
                  labelStyle={userinfo.college.show ? {} : styles.hideInfo}
                />
                <Toggle
                  label={`专业：${userinfo.major.value}`}
                  toggled={Boolean(userinfo.major.show)}
                  style={styles.toggle}
                  onToggle={() => { this.onToggle('major'); }}
                  labelStyle={userinfo.major.show ? {} : styles.hideInfo}
                />
              </div>
            </Paper>

            <Paper zDepth={1} rounded={false} className="paper">
              <div className="block">
                <h4>完善信息有利于别人更加了解您</h4>

                <div className="box">
                  <div className="label">
                    <span style={userinfo.email.show ? {} : styles.hideInfo}>*邮箱：</span>
                  </div>
                  <div className="text">
                    <TextField
                      value={userinfo.email.value}
                      hintText="请输入您的邮箱"
                      onChange={(event) => { this.handleChange(event.target.value, 'email'); }}
                      inputStyle={userinfo.email.show ? {} : styles.hideInfo}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div className="toggle">
                    <Toggle
                      toggled={Boolean(userinfo.email.show)}
                      style={styles.toggle}
                      onToggle={() => { this.onToggle('email'); }}
                    />
                  </div>
                </div>

                <div className="box">
                  <div className="label">
                    <span style={userinfo.phone.show ? {} : styles.hideInfo}>手机：</span>
                  </div>
                  <div className="text">
                    <TextField
                      value={userinfo.phone.value}
                      hintText="请输入您的手机号"
                      onChange={(event) => { this.handleChange(event.target.value, 'phone'); }}
                      inputStyle={userinfo.phone.show ? {} : styles.hideInfo}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div className="toggle">
                    <Toggle
                      toggled={Boolean(userinfo.phone.show)}
                      onToggle={() => { this.onToggle('phone'); }}
                      style={styles.toggle}
                    />
                  </div>
                </div>

                <div className="box">
                  <div className="label">
                    <span style={userinfo.wechat.show ? {} : styles.hideInfo}>微信：</span>
                  </div>
                  <div className="text">
                    <TextField
                      hintText="请输入您的微信号"
                      value={userinfo.wechat.value}
                      onChange={(event) => { this.handleChange(event.target.value, 'wechat'); }}
                      inputStyle={userinfo.wechat.show ? {} : styles.hideInfo}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div className="toggle">
                    <Toggle
                      toggled={Boolean(userinfo.wechat.show)}
                      style={styles.toggle}
                      onToggle={() => { this.onToggle('wechat'); }}
                    />
                  </div>
                </div>

                <div className="box">
                  <div className="label">
                    <span style={userinfo.qq.show ? {} : styles.hideInfo}>QQ：</span>
                  </div>
                  <div className="text">
                    <TextField
                      hintText="请输入您的QQ号"
                      value={userinfo.qq.value}
                      onChange={(event) => { this.handleChange(event.target.value, 'qq'); }}
                      inputStyle={userinfo.qq.show ? {} : styles.hideInfo}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div className="toggle">
                    <Toggle
                      toggled={Boolean(userinfo.qq.show)}
                      style={styles.toggle}
                      onToggle={() => { this.onToggle('qq'); }}
                    />
                  </div>
                </div>

                <div className="box">
                  <div className="label">
                    <span style={userinfo.introduction.show ? {} : styles.hideInfo}>个人简介：</span>
                  </div>
                  <div className="text">
                    <TextField
                      hintText="请输入您的个人简介"
                      value={userinfo.introduction.value}
                      multiLine
                      rows={3}
                      onChange={(event) => { this.handleChange(event.target.value, 'introduction'); }}
                      textareaStyle={userinfo.introduction.show ? {} : styles.hideInfo}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div className="toggle">
                    <Toggle
                      toggled={Boolean(userinfo.introduction.show)}
                      style={styles.toggle}
                      onToggle={() => { this.onToggle('introduction'); }}
                    />
                  </div>
                </div>

                <div className="box">
                  <div className="label">
                    <span style={userinfo.projects.show ? {} : styles.hideInfo}>项目经历：</span>
                  </div>
                  <div className="text">
                    <TextField
                      hintText="如xx年xx至xx年xx月, xx项目"
                      value={userinfo.projects.value}
                      multiLine
                      rows={3}
                      onChange={(event) => { this.handleChange(event.target.value, 'projects'); }}
                      textareaStyle={userinfo.projects.show ? {} : styles.hideInfo}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div className="toggle">
                    <Toggle
                      toggled={Boolean(userinfo.projects.show)}
                      style={styles.toggle}
                      onToggle={() => { this.onToggle('projects'); }}
                    />
                  </div>
                </div>

                <div className="box">
                  <div className="label">{' '}</div>
                  <div className="text">
                    <RaisedButton label="保存" onClick={this.handleSave} primary style={{ marginTop: 20 }} />
                  </div>
                  <div className="toggle">{' '}</div>
                </div>
              </div>
            </Paper>

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
      </div>
    );
  }
}


export default Userinfo;
