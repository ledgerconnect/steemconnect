import React, { PropTypes } from 'react';
import Dropzone from 'react-dropzone';

const AvatarUpdate = (props) => {
  return (<div onClick={props.onClick} style={{ backgroundImage: `url(https://img.busy6.com/@${props.username}/cover) !important` }}>
    <Dropzone className="xx" onDrop={files => props.onDrop(files, 'profile_image')} accept="image/*">
      <a className="placeholder"><i className="icon icon-md material-icons">file_upload</i> Edit</a>
      <img alt="Profile" className="profile-image" src={`https://img.busy6.com/@${props.username}`} />
    </Dropzone>
    <Dropzone className="xx" onDrop={files => props.onDrop(files, 'cover_image')} accept="image/*">
      <i className="icon icon-md material-icons">file_upload</i> Edit Cover
    </Dropzone>
  </div>);
};

AvatarUpdate.propTypes = {
  username: PropTypes.string.isRequired,
  onDrop: PropTypes.func,
  onClick: PropTypes.func,
};


export default AvatarUpdate;
