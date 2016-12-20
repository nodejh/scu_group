import React from 'react';
// import RaisedButton from 'material-ui/RaisedButton';
// import { browserHistory } from 'react-router';
// import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
// import DatePicker from 'material-ui/DatePicker';
// import SelectField from 'material-ui/SelectField';
// import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
// import Toggle from 'material-ui/Toggle';
import App from './../App';
import './Publish.css';
// import ImageUpload from './ImageUpload';
import './Userinfo.css';

const URL_GET_USERINFO = '/api/user/userinfo';
// const styles = {
//   toggle: {
//     marginBottom: 16,
//   },
//   thumbOff: {
//     backgroundColor: '#ffcccc',
//   },
//   trackOff: {
//     backgroundColor: '#ff9d9d',
//   },
//   thumbSwitched: {
//     backgroundColor: 'red',
//   },
//   trackSwitched: {
//     backgroundColor: '#ff9d9d',
//   },
//   labelStyle: {
//     color: 'red',
//   },
//   hideInfo: {
//     color: '#bdbdbd',
//   },
// };

class Detail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dialog: {
        open: false,
        text: '出错了...',
      },
      screen: {
        isSmallScreen: true,
        containerStyle: {},
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
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleDialogOpen = this.handleDialogOpen.bind(this);
    this.getUserinfo = this.getUserinfo.bind(this);
    this.handleScreenInfo = this.handleScreenInfo.bind(this);
  }


  componentDidMount() {
    this.getUserinfo();
  }


  getUserinfo() {
    // console.log('data: ', data);
    const url = `${URL_GET_USERINFO}/${this.props.params.id}`;
    // console.log('url: ', url);
    fetch(url, {
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
        // 发布成功
        // 跳转到所有已发布页(首页)
        // browserHistory.push('/');
        // console.log('getUserinfo: ', responseJson);
        this.setState({
          userinfo: responseJson.data.userinfo,
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


  handleScreenInfo(value, style) {
    // console.log('handleScreenInfo: ', value, style);
    const screen = {
      isSmallScreen: value,
      containerStyle: style,
    };
    this.setState({ screen });
  }


  handleChangeTitle(value) {
    this.setState({
      title: value,
    });
  }


  render() {
    // console.log('this.props: ', this.props);
    const containerStyle = this.state.screen.containerStyle;
    const actions = [
      <FlatButton
        label="确定"
        primary
        onTouchTap={this.handleDialogClose}
      />,
    ];
    const userinfo = this.state.userinfo;
    return (
      <div>
        <App title="用户详情" cbScreenInfo={this.handleScreenInfo} />
        <div style={containerStyle}>
          <div className="content">
            <Paper zDepth={1} rounded={false} className="paper">
              <h3>{userinfo.name.value}的个人信息</h3>
              <div>
                <div>
                  <p>姓名：{userinfo.name.value}</p>
                </div>
                <div>
                  <p>性别：{userinfo.gender.value}</p>
                </div>
                <div>
                  <p>年级：{userinfo.grade.value}</p>
                </div>
                <div>
                  <p>学院：{userinfo.college.value}</p>
                </div>
                <div>
                  <p>专业：{userinfo.major.value}</p>
                </div>
                <div>
                  <p>手机：{userinfo.phone.value}</p>
                </div>
                <div>
                  <p>邮箱：{userinfo.email.value}</p>
                </div>
                <div>
                  <p>微信：{userinfo.wechat.value}</p>
                </div>
                <div>
                  <p>QQ：{userinfo.phone.value}</p>
                </div>
                <div>
                  <p>个人简介：{userinfo.introduction.value}</p>
                </div>
                <div>
                  <p>项目经历：{userinfo.projects.value}</p>
                </div>
              </div>
            </Paper>
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


Detail.propTypes = {
  // eslint-disable-next-line
  params: React.PropTypes.object,
};


export default Detail;
