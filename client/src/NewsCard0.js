import React from 'react';
// import { GridList, GridTile } from 'material-ui/GridList';
// import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
// import StarBorder from 'material-ui/svg-icons/toggle/star-border';
// import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import { Card, CardActions, CardHeader, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { browserHistory } from 'react-router';
import Dialog from 'material-ui/Dialog';
import { formatTime, formatDate } from './Helper/Date';
import './NewsCard.css';


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
      expanded: {},
    };
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleDialogOpen = this.handleDialogOpen.bind(this);
    this.linkTo = this.linkTo.bind(this);
  }


  linkTo(link, params) {
    browserHistory.push(link, {
      query: { id: params },
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

  render() {
    console.log(this.props.userinfo);
    const actions = [
      <FlatButton
        label="确定"
        primary
        onTouchTap={this.handleDialogClose}
      />,
    ];
    const news = this.props.news;
    return (
      <div>
        <Subheader>活动列表</Subheader>
        <div className="root">
          {news.map(item => (
            <Card
              key={item._id}
              className="card"
              expandable
              // expanded={Boolean(this.state.expanded[item._id])}
            >
              <CardHeader
                title={item.user.name.value}
                subtitle={formatTime(item.datetime)}
                avatar={`/uploads/avatars/${item.user.avatar}`}
                titleStyle={{ marginBottom: 13 }}
                actAsExpander
                showExpandableButton
              />
              {/* <CardTitle subtitle={`[${item.type}] ${item.title}`} /> */}
              <CardTitle title={item.title} subtitle={`#${item.type}`} />
              <CardText
                className="cardText"
              >
                <span className="cardTextTips">[活动简介]</span>{item.introduction}
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
              <CardActions>
                <FlatButton onClick={() => this.linkTo(`/user/detail/${item._id}`)} primary label="详情" />
                {
                  item.user._id !== this.props.userinfo._id &&
                    <FlatButton primary label="加入" onTouchTap={this.handleOpen} />
                }
              </CardActions>
            </Card>
          ))}
        </div>
        <Dialog
          title="提示"
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


NewsCard.propTypes = {
  // eslint-disable-next-line
  news: React.PropTypes.array,
  // eslint-disable-next-line
  userinfo: React.PropTypes.object,
};


export default NewsCard;
