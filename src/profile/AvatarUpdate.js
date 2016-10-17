import React, { PropTypes } from 'react';
import Dropzone from 'react-dropzone';


const AvatarUpdate = (props) => {
  var userBackground = {
      background: `radial-gradient(circle at 50% 0%, rgba(0, 0, 0, 0.0980392), rgba(0, 0, 0, 0.6)), url("https://img.busy6.com/@${props.username}/cover")`,
      backgroundSize: `cover`,
      backgroundPosition: `center`,
    };
  return (
    <section className="align-center profile-header" onClick={props.onClick} style={userBackground}>
      <div className="container">
        <Dropzone className="dropzone dropzone-profile" onDrop={files => props.onDrop(files, 'profile_image')} accept="image/*">
          <a className="placeholder">
            <i className="icon icon-md material-icons">file_upload</i>
            <img alt="Profile" className="profile-image" src={`https://img.busy6.com/@${props.username}`} />
          </a>
        </Dropzone>
        <Dropzone className="dropzone dropzone-background" onDrop={files => props.onDrop(files, 'cover_image')} accept="image/*">
          <a className="btn btn-md btn-secondary placeholder">
            <i className="icon icon-md material-icons">file_upload</i>Edit Cover
          </a>
        </Dropzone>
      </div>
    </section>
  );
};

AvatarUpdate.propTypes = {
  username: PropTypes.string.isRequired,
  onDrop: PropTypes.func,
  onClick: PropTypes.func,
};


export default AvatarUpdate;
