import React from 'react';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import AppBarIconMenu from './AppBarIconMenu';
import MenuItem from 'material-ui/MenuItem';
import { browserHistory } from 'react-router';

const URL_GET_USERINFO = '/userinfo';


export default class DrawerOpenRightExample extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      open: true,
      userinfo: {
        name: '蒋航',
        grade: '2014',
        college: '计算机学院',
        major: '物联网工程',
        number: '2013141223047'
      }
    };
  }

  handleToggle = () => this.setState({open: !this.state.open});

  linkTo(link) {
    browserHistory.push(link);
  }

  render() {
    return (
      <div>
        <MenuItem onClick={() => this.linkTo('/')}>所有活动</MenuItem>
        {/* <MenuItem onClick={() => this.linkTo('/user/post')}>发布活动</MenuItem>
          <MenuItem onClick={() => this.linkTo('/user/info')}>个人信息</MenuItem>
          <MenuItem onClick={() => this.linkTo('/user/publish')} >我的发布</MenuItem>
        <MenuItem onClick={() => this.linkTo('/user/join')}>我的参与</MenuItem> */}
      </div>
    );
  }
}
