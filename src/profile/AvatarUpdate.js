import React, { PropTypes } from 'react';
import Dropzone from 'react-dropzone';


const AvatarUpdate = (props) => {
  var userBackground = {
    backgroundImage: `url(https://img.busy6.com/@${props.username}/cover)`,
  };
  return (
    <div onClick={props.onClick} style={userBackground}>
      
      <img alt="Profile" className="profile-image" src={`https://img.busy6.com/@${props.username}`} />
      <div>
        <Dropzone className="xx" onDrop={files => props.onDrop(files, 'profile_image')} accept="image/*">
          <a className="placeholder"><i className="icon icon-md material-icons">file_upload</i> Edit Image
          </a>
        </Dropzone>
      </div>
      <Dropzone className="xx" onDrop={files => props.onDrop(files, 'cover_image')} accept="image/*">
        <a className="placeholder"><i className="icon icon-md material-icons">file_upload</i> Edit Cover
        </a>
      </Dropzone>
    </div>
  );
};

AvatarUpdate.propTypes = {
  username: PropTypes.string.isRequired,
  onDrop: PropTypes.func,
  onClick: PropTypes.func,
};


export default AvatarUpdate;
