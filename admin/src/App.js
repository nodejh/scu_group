import React from 'react';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import AppBarIconMenu from './AppBarIconMenu';
import MenuItems from './MenuItems.js';
import Publishes from './Publishes';
import { browserHistory } from 'react-router';

const URL_GET_REALSE = '/admin/release';


export default class DrawerOpenRightExample extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      release: [],
      open: true,
      user: {
        number: '',
        info: {
          name: '',
        },
      },
    };
    this.getRelease = this.getRelease.bind(this);
  }

  componentWillMount() {
    this.getRelease();
  }

  handleToggle = () => this.setState({open: !this.state.open});

  getRelease() {
    fetch(URL_GET_REALSE, {
      method: 'GET',
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
        this.setState({
          release: responseJson.data.release,
        });
      } else {
        this.handleOpenDialog(responseJson.error);
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
    return (
      <div>
        <div style={{width: '200px'}}>
          <Drawer width={200} open={this.state.open} >
            <AppBar title={this.state.user.info.name} />
            <MenuItems />
          </Drawer>
        </div>
        <div style={{marginLeft: '200px'}}>
          <AppBarIconMenu />
          <Publishes release={this.state.release}/>
        </div>
      </div>
    );
  }
}
