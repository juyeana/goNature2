import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import DefaultImg from '../../img/default.jpg';
import { storage } from './firebase_config';
import { updateUser } from '../../actions/authActions';

class UploadImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firebaseImage: DefaultImg,
    };
  }
  setDefaultImage(uploadType) {
    if (uploadType === 'firebase') {
      this.setState({
        firebaseImage: this.props.auth.user.imageData,
      });
    } else {
      this.setState({
        firebaseImage: DefaultImg,
      });
    }
  }

  uploadImage(e, method) {
    let imageObj = {};

    if (method === 'firebase') {
      let currentImageName = this.props.auth.user.name + '_' + Date.now();

      let uploadImage = storage
        .ref(`images/${currentImageName}`)
        .put(e.target.files[0]);

      uploadImage.on(
        'state_changed',
        (snapshot) => {},
        (error) => {
          alert(error);
        },
        () => {
          storage
            .ref('images')
            .child(currentImageName)
            .getDownloadURL()
            .then((url) => {
              this.setState({
                firebaseImage: url,
              });

              // store image object in the database
              imageObj = {
                imageName: currentImageName,
                imageData: url,
              };

              axios
                .patch(`/api/v1/users/upload-image`, imageObj)
                .then((data) => {
                  if (data.data) {
                    this.props.updateUser(data.data);
                    alert('Image has been successfully uploaded');
                    this.setDefaultImage('firebase');
                  }
                })
                .catch((err) => {
                  alert('Error while uploading image');
                  this.setDefaultImage('firebase');
                });
            });
        }
      );
    }
  }

  componentDidMount() {
    if (this.props.auth.user.imageData) {
      this.setState({ firebaseImage: this.props.auth.user.imageData });
    } 
    else {
      this.setState({ firebaseImage: DefaultImg });
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.auth.user.imageData !== this.props.auth.user.imageData) {
      this.setState({ firebaseImage: this.props.auth.user.imageData });
    }
  }

  render() {
    return (
      <div className='u-margin-top-medium'>
        {/* <h2 className='heading-tertiary'>upload picture</h2> */}

        <div className='u-margin-both-big'>
          <img
            className='profile__image  circle u-margin-center'
            src={this.state.firebaseImage}
            alt='profile'
          />
          <label htmlFor='myImage'>Choose new photo</label>
          <input
            type='file'
            id='myImage'
            onChange={(e) => this.uploadImage(e, 'firebase')}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({ auth: state.auth });

export default connect(mapStateToProps, { updateUser })(UploadImage);
