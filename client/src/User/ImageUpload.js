import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';


class ImageUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: '',
      imagePreviewUrl: '',
      avatar: '',
      dialog: {
        open: false,
        text: '出错了...',
      },
    };
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDialogOpen = this.handleDialogOpen.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
  }

  componentWillMount() {
    // this.getUserinfo();
  }


  handleSubmit(event) {
    event.preventDefault();
    if (!this.state.file) {
      this.handleDialogOpen('请选择图片后再上传');
      return false;
    }
    this.uploadImage(this.state.file)
      .then((result) => {
        // console.log('result: ', result);
        if (result.code === 0) {
          this.handleDialogOpen('上传成功！');
        } else {
          this.handleDialogOpen('上传失败，请重试！');
        }
      })
      .catch((e) => {
        // console.error(e);
        this.handleDialogOpen(e.message);
      });
  }


  handleImageChange(event) {
    event.preventDefault();

    const reader = new FileReader();
    const file = event.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file,
        imagePreviewUrl: reader.result,
      });
    };
    reader.readAsDataURL(file);
  }


  uploadImage(imageFile) {
    return new Promise((resolve, reject) => {
      const imageFormData = new FormData();

      imageFormData.append('imageFile', imageFile);

      const xhr = new XMLHttpRequest();

      xhr.open('post', '/api/user/avatar', true);

      xhr.onload = function onload() {
        if (this.status === 200) {
          resolve(JSON.parse(this.response));
        } else {
          reject(this.statusText);
        }
      };

      xhr.send(imageFormData);
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
    const actions = [
      <FlatButton
        label="确定"
        primary
        onTouchTap={this.handleDialogClose}
      />,
    ];
    const propsAvatar = `/uploads/avatars/${this.props.avatar}`;
    const imagePreviewUrl = this.state.imagePreviewUrl ? this.state.imagePreviewUrl : propsAvatar;
    let $imagePreview = null;
    if (this.state.imagePreviewUrl || this.props.avatar) {
      $imagePreview = (
        <img
          alt="头像"
          src={imagePreviewUrl}
          role="presentation"
          style={{ height: '100%', maxWidth: '90%' }}
        />
      );
    }
    // console.log('imagePreviewUrl: ', imagePreviewUrl);
    return (
      <div>
        <div style={{ marginBottom: 30 }}>
          <div style={{ height: 100, width: 'auto' }}>
            {$imagePreview}
          </div>
          <form onSubmit={this.handleSubmit}>
            <input type="file" onChange={this.handleImageChange} accept="image/*" />
            <RaisedButton
              label="上传头像"
              primary
              style={{ marginTop: 12, height: 30, lineHeight: '30px' }}
              onClick={this.handleSubmit}
            />
          </form>
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
    );
  }
}


ImageUpload.propTypes = {
  avatar: React.PropTypes.string,
};


export default ImageUpload;
