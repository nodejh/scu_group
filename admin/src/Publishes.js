import React from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import imgAvatar from './avatar.jpg';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { browserHistory, router, Link } from 'react-router';
import Dialog from 'material-ui/Dialog';

const URL_REALSE_DELETE = '/admin/release/delete';


const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    margin: 30,
    width: 600,
    height: 'auto',
    overflowY: 'auto',
  },
};

function formatTime(unix_timestamp) {
  var date = new Date(unix_timestamp);
// Hours part from the timestamp
var hours = date.getHours();
// Minutes part from the timestamp
var minutes = "0" + date.getMinutes();
// Seconds part from the timestamp
var seconds = "0" + date.getSeconds();

var year = date.getFullYear();
var month = date.getMonth() + 1;
var day = date.getDate();

// Will display time in 10:30:23 format
  return `${year}.${month}.${day} ${hours}:${minutes.substr(-2)}:${seconds.substr(-2)}`;
}


class GridListExampleSimple extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dialog: false,
      title: '删除失败'
    };
  }

  linkTo(link, params) {
    browserHistory.push(link, {
      query: {id: 1},
    });
  }

  handleOpen = (title) => {
    this.setState({
      dialog: true,
      title,
    });
  };

  handleClose = () => {
    this.setState({dialog: false});
  };

  handleDelete = (id) => {
    console.log('id: ', id);
    fetch(URL_REALSE_DELETE + '?id=' + id, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log('fetch responseJson: ', responseJson);
      if (responseJson.code === 0) {
        this.handleOpen('删除成功！');
      } else {
        this.handleOpen(responseJson.error);
      }
    })
    .catch((error) => {
      console.error(error);
      this.setState({
        isLoading: false
      });
    });
  }


  render() {
    const actions = [
      <FlatButton
        label="确认"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose}
      />,
    ];
    const release = this.props.release;
    return (
      <div style={styles.root}>
        <GridList
          cellHeight={300}
          style={styles.gridList}
        >
          <Subheader>活动列表</Subheader>
          {release.map((item) => (
            <GridTile
              key={item._id}
              // title={tile.title}
              // subtitle={<span>by <b>{tile.author}</b></span>}
              // actionIcon={<IconButton><StarBorder color="white" /></IconButton>}
            >
              <Card>
                <CardHeader
                  title={item.name}
                  subtitle={formatTime(item.datetime)}
                  avatar={imgAvatar}
                />
                <CardTitle subtitle={`[${item.type}] ${item.title}`} />
                <CardText>
                  活动简介：{item.introduction}
                  <br/>
                  <br/>
                  团队现况：{item.team_info}
                  <br/>
                  <br/>
                  队员要求：{item.requirement}
                </CardText>
                <CardActions>
                  {/* <FlatButton onClick={() => this.linkTo('/user/detail/' + item._id)} primary label="详情" /> */}
                  <FlatButton primary label="删除" onTouchTap={() => this.handleDelete(item._id)} />
                </CardActions>
              </Card>

            </GridTile>
          ))}
        </GridList>

        <Dialog
          title="提示"
          actions={actions}
          modal={false}
          open={this.state.dialog}
          onRequestClose={this.handleClose}
        >
          {this.state.title}
        </Dialog>
      </div>
    );
  }
}

export default GridListExampleSimple;
