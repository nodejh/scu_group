import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { browserHistory } from 'react-router';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
// import DatePicker from './../DatePickerCN';
import App from './../App';
import './Publish.css';

const URL_GET_USERINFO = '/api/user/publish';


class Publish extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      introduction: '',
      teamInfo: '',
      requirement: '',
      deadline: '',
      type: '',
      dialog: {
        open: false,
        text: '出错了...',
      },
      screen: {
        isSmallScreen: true,
        containerStyle: {},
      },
    };
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleDialogOpen = this.handleDialogOpen.bind(this);
    this.handlePublish = this.handlePublish.bind(this);
    this.handleScreenInfo = this.handleScreenInfo.bind(this);
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeIntroduction = this.handleChangeIntroduction.bind(this);
    this.handleChangeTeamInfo = this.handleChangeTeamInfo.bind(this);
    this.handleChangeRequirement = this.handleChangeRequirement.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeType = this.handleChangeType.bind(this);
    this.checkFormData = this.checkFormData.bind(this);
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

  checkFormData() {
    if (!this.state.title) {
      this.handleDialogOpen('标题不能为空');
      return false;
    }
    if (!this.state.introduction) {
      this.handleDialogOpen('活动简介不能为空');
      return false;
    }
    if (!this.state.teamInfo) {
      this.handleDialogOpen('团队现状不能为空');
      return false;
    }
    if (!this.state.requirement) {
      this.handleDialogOpen('队员要求不能为空');
      return false;
    }
    if (!this.state.deadline) {
      this.handleDialogOpen('截止日期不能为空');
      return false;
    }
    if (!this.state.type) {
      this.handleDialogOpen('请选择活动分类');
      return false;
    }
    return true;
  }


  handlePublish() {
    if (!this.checkFormData()) {
      return false;
    }
    const data = {
      title: this.state.title,
      introduction: this.state.introduction,
      teamInfo: this.state.teamInfo,
      requirement: this.state.requirement,
      deadline: this.state.deadline,
      type: this.state.type,
    };
    // console.log('data: ', data);
    fetch(URL_GET_USERINFO, {
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
      if (responseJson.code === 0) {
        // 发布成功
        // 跳转到所有已发布页(首页)
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

  handleChangeIntroduction(value) {
    this.setState({
      introduction: value,
    });
  }

  handleChangeTeamInfo(value) {
    this.setState({
      teamInfo: value,
    });
  }

  handleChangeRequirement(value) {
    this.setState({
      requirement: value,
    });
  }

  handleChangeDate(a, value) {
    // console.log(value.getTime());
    this.setState({
      deadline: value.getTime(),
    });
  }


  handleChangeType(event, index, value) {
    // console.log(value);
    this.setState({
      type: value,
    });
  }


  render() {
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
        <App title="发布活动" cbScreenInfo={this.handleScreenInfo} />
        <div style={containerStyle}>
          <div className="content">
            <Paper zDepth={1} rounded={false} className="paper">
              <div className="block">
                <h3>发布活动</h3>
                <div className="box">
                  <div className="label">
                    <span>标题</span>
                  </div>
                  <div className="text">
                    <TextField
                      hintText="请输入活动标题"
                      value={this.state.title}
                      style={{ width: '100%' }}
                      onChange={(event) => { this.handleChangeTitle(event.target.value); }}
                    />
                  </div>
                </div>

                <div className="box">
                  <div className="label">
                    <span>活动简介</span>
                  </div>
                  <div className="text">
                    <TextField
                      value={this.state.introduction}
                      hintText="请输入活动简介"
                      onChange={(event) => { this.handleChangeIntroduction(event.target.value); }}
                      multiLine
                      rows={3}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                <div className="box">
                  <div className="label">
                    <span>团队现状</span>
                  </div>
                  <div className="text">
                    <TextField
                      hintText="请输入团队现状"
                      value={this.state.teamInfo}
                      onChange={(event) => { this.handleChangeTeamInfo(event.target.value); }}
                      multiLine
                      rows={3}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                <div className="box">
                  <div className="label">
                    <span>队员要求</span>
                  </div>
                  <div className="text">
                    <TextField
                      hintText="包括人数、具体要求"
                      value={this.state.requirement}
                      onChange={(event) => { this.handleChangeRequirement(event.target.value); }}
                      multiLine
                      rows={3}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                <div className="box">
                  <div className="label">
                    <span>活动分类：</span>
                  </div>
                  <div className="text">
                    <SelectField
                      floatingLabelText="选择分类"
                      value={this.state.type}
                      onChange={this.handleChangeType}
                      style={{ width: '100%' }}
                    >
                      <MenuItem value={'比赛'} primaryText="比赛" />
                      <MenuItem value={'学习'} primaryText="学习" />
                      <MenuItem value={'创业'} primaryText="创业" />
                      <MenuItem value={'娱乐'} primaryText="娱乐" />
                    </SelectField>
                  </div>
                </div>


                <div className="box">
                  <div className="label">
                    <span>截止日期</span>
                  </div>
                  <div className="text">
                    <DatePicker
                      onChange={this.handleChangeDate}
                      hintText="请选择截止日期"
                      textFieldStyle={{ width: '100%' }}
                    />
                  </div>
                </div>

                <div className="box">
                  <div className="label">{''}</div>
                  <div className="text">
                    <RaisedButton
                      label="发布"
                      onClick={() => this.handlePublish()}
                      primary
                      style={{ marginTop: 30 }}
                    />
                  </div>
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


export default Publish;
