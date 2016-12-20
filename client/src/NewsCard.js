import React from 'react';
import ReactDOM from 'react-dom';
// import { GridList, GridTile } from 'material-ui/GridList';
// import IconButton from 'material-ui/IconButton';
// import Subheader from 'material-ui/Subheader';
// import StarBorder from 'material-ui/svg-icons/toggle/star-border';
// import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import { Card, CardActions, CardHeader, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { browserHistory } from 'react-router';
import Dialog from 'material-ui/Dialog';
import Toggle from 'material-ui/Toggle';
import { formatTime, formatDate } from './Helper/Date';
import './NewsCard.css';


const URL_JOIN = '/api/user/join';


class NewsCard extends React.Component {

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
      expanded: false,
      noEmailOpen: false,
    };
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleDialogOpen = this.handleDialogOpen.bind(this);
    // this.linkTo = this.linkTo.bind(this);
    this.handleJoin = this.handleJoin.bind(this);
    this.handleOnAvatarClick = this.handleOnAvatarClick.bind(this);
    this.handleNoEmailOpen = this.handleNoEmailOpen.bind(this);
    this.handleCheckEmailIsValid = this.handleCheckEmailIsValid.bind(this);
    this.handleDialogEmailClose = this.handleDialogEmailClose.bind(this);
  }

  componentDidMount() {
    this.handleOnAvatarClick();
  }


  // 监听头像图片的点击事件
  handleOnAvatarClick() {
    // eslint-disable-next-line
    const cardHeader = ReactDOM.findDOMNode(this.refs.cardHeader);
    const news = this.props.news;
    const link = `/user/userinfo/${news.user._id}`;
    cardHeader.onclick = function onclick(event) {
      event.preventDefault();
      if (event.srcElement.tagName.toLocaleUpperCase() === 'IMG') {
        browserHistory.push(link);
      }
    };
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


  handleExpandChange = (expanded) => {
    this.setState({
      expanded,
    });
  }


  handleToggle = (event, toggle) => {
    this.setState({
      expanded: toggle,
    });
  }


  // 判断用户邮箱是否经过验证
  handleCheckEmailIsValid() {
    // console.log('this.props.isCurrentUserEmailValid: ', this.props.isCurrentUserEmailValid);
    if (!this.props.isCurrentUserEmailValid) {
      this.handleNoEmailOpen();
      return false;
    }
    return true;
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

  handleJoin(_id) {
    // console.log('_id: ', _id);
    // return false;
    const isEmailValidated = this.handleCheckEmailIsValid();
    if (!isEmailValidated) return false;
    // console.log('isEmailValidated: ', isEmailValidated);
    const data = { _id };
    fetch(URL_JOIN, {
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
        // 加入成功
        // 跳转到加入的列表
        this.handleDialogOpen('加入活动成功！');
        // browserHistory.push('/user/joined_list');
      } else {
        this.handleDialogOpen(responseJson.message);
      }
    })
    .catch((e) => {
      // console.error(e);
      this.handleDialogOpen(e.message);
    });
  }

  render() {
    // console.log(this.props.userinfo);
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
    const item = this.props.news;
    let introduction = item.introduction;
    if (!this.state.expanded && introduction.length > 150) {
      introduction = `${introduction.substr(0, 150)}...`;
    }
    let joinedNumberDom = '';
    if (item.joinedUsers.length > 0) {
      joinedNumberDom = (
        <div>
          {item.joinedUsers.length}
          <span
            style={{ color: 'rgba(0, 0, 0, 0.5)', fontSize: '0.7em', margin: '0 10px 0 2px' }}
          >人已加入</span>
        </div>
      );
    }
    // TODO 修改名字显示
    const username = `${item.user.name.value.substr(0, 1)}同学`;
    return (
      <Card
        key={item._id}
        className="card"
        expandable
        expanded={this.state.expanded}
        onExpandChange={this.handleExpandChange}
      >
        <CardHeader
          title={username}
          subtitle={formatTime(item.datetime)}
          avatar={`/uploads/avatars/${item.user.avatar}`}
          titleStyle={{ marginBottom: 13 }}
          className="cardHeader"
          // onTouchTap={() => this.linkTo(`/user/userinfo/${item.user._id}`)}
          // eslint-disable-next-line
          ref="cardHeader"
          showExpandableButton
        />
        {/* <CardTitle subtitle={`[${item.type}] ${item.title}`} /> */}
        <CardTitle title={item.title} subtitle={`#${item.type}`} />
        <CardText
          className="cardText"
        >
          <span className="cardTextTips">[活动简介]</span>{introduction}
        </CardText>
        <CardText className="cardText" expandable>
          <span className="cardTextTips">[团队现况]</span>{item.teamInfo}
        </CardText>
        <CardText className="cardText" expandable>
          <span className="cardTextTips">[队员要求]</span>{item.requirement}
        </CardText>
        <CardText className="cardText" expandable>
          <span className="cardTextTips">[截止日期]</span>{formatDate(item.deadline)}
        </CardText>
        <CardActions
          style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <div
              style={{ lineHeight: '24px', paddingLeft: '8px' }}
            >
              {joinedNumberDom}
            </div>
            <Toggle
              toggled={this.state.expanded}
              onToggle={this.handleToggle}
              labelPosition="right"
              label="详情"
              labelStyle={{ color: 'rgba(0, 0, 0, 0.5)', fontSize: '0.7em' }}
              style={{ width: '100px' }}
            />
          </div>
          <div>
            {
              item.user._id !== this.props.userinfo._id &&
                <RaisedButton
                  label="加入"
                  primary
                  style={{ margin: 12 }}
                  onTouchTap={() => { this.handleJoin(item._id); }}
                />
            }
          </div>

        </CardActions>
        <Dialog
          title="提示"
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
          请先进入个人中心填写并验证邮箱后再加入活动
        </Dialog>

      </Card>
    );
  }
}


NewsCard.propTypes = {
  // eslint-disable-next-line
  news: React.PropTypes.object,
  // eslint-disable-next-line
  userinfo: React.PropTypes.object,
  isCurrentUserEmailValid: React.PropTypes.bool,
};


export default NewsCard;
