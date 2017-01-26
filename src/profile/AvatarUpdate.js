import React, { PropTypes } from 'react';
import Dropzone from 'react-dropzone';

const AvatarUpdate = (props) => {
  const cacheBuster = Math.random() * 10000000000000000;
  const userBackground = {
    background: `url("https://img.steemconnect.com/@${props.username}/cover?${cacheBuster}") center center / cover`,
  };
  return (
    <div className="profile-header" onClick={props.onClick} style={userBackground}>
      <img alt="Profile" className="profile-image mt-5 mb-4" src={`https://img.steemconnect.com/@${props.username}?${cacheBuster}`} />
      <div className="pb-5">
        <Dropzone className="dropzone" onDrop={files => props.onDrop(files, 'profile_image')} accept="image/*">
          <button className="btn btn-primary">
            <i className="icon icon-md material-icons">file_upload</i> Upload profile image
          </button>
        </Dropzone><span className="spacer" />
        <Dropzone className="dropzone" onDrop={files => props.onDrop(files, 'cover_image')} accept="image/*">
          <button className="btn btn-primary">
            <i className="icon icon-md material-icons">file_upload</i> Upload cover image
          </button>
        </Dropzone>
      </div>
    </div>
  );
};

AvatarUpdate.propTypes = {
  username: PropTypes.string.isRequired,
  onDrop: PropTypes.func,
  onClick: PropTypes.func,
};

export default AvatarUpdate;
