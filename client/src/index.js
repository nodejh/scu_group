import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Router, Route, browserHistory } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import App from './App';
import AllNews from './AllNews';
import UserNews from './User/News';
import UserDetail from './User/Detail'; // 用户详情
import Userinfo from './User/Userinfo'; // 用户个人信息
import UserPublish from './User/Publish'; // 发布信息
import UserJoinedList from './User/JoinedList';
import Login from './Login';
import './index.css';

injectTapEventPlugin();


ReactDOM.render(
  <MuiThemeProvider>
    <Router history={browserHistory}>
      <Router path="/" component={AllNews} />
      <Router path="/user/userinfo" component={Userinfo} />
      <Router path="/user/publish" component={UserPublish} />
      <Router path="/user/news" component={UserNews} />
      <Router path="/user/userinfo/:id" component={UserDetail} />
      <Router path="/user/joined_list" component={UserJoinedList} />
      <Route path="/login" component={Login} />
    </Router>
  </MuiThemeProvider>,
  document.getElementById('root')
);
