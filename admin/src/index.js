import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
 import App from './App';
import './index.css';


injectTapEventPlugin();

const AppPage = () => (
  <MuiThemeProvider>
    <App />
  </MuiThemeProvider>
);


ReactDOM.render(
  <Router history={browserHistory}>
    <Route path='/' component={AppPage} />
    {/* <Route path='/logout' component={LoginPage} />
      <Route path='/post' component={PostPage} />
      <Route path='/user' component={UserPage} />
      <Route path='/user/info' component={UserInfoPage} />
      <Route path='/user/join' component={UserJoinPage} />
      <Route path='/user/publish' component={UserPublishPage} />
      <Route path='/user/post' component={UserPostPage} />
    <Route path='/user/detail/:id' component={DetailPage} /> */}
  </Router>,
  document.getElementById('root')
);
