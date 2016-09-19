import React, { PropTypes } from 'react';
import Dropzone from 'react-dropzone';

const EditImageHeader = (props) => {
  let username;
  let deleteBtn;
  let dropZone;

  if (props.onDrop) {
    dropZone = (<div>
      <Dropzone className="avatar" onDrop={files => props.onDrop(files, 'profile_image')} accept="image/*">
        <a className="placeholder"><i className="icon icon-md material-icons">file_upload</i> Edit</a>
        <img alt="Profile" src={`https://img.busy6.com/@${props.username}`} />
      </Dropzone>
      <Dropzone className="cover-edit" onDrop={files => props.onDrop(files, 'cover_image')} accept="image/*">
        <i className="icon icon-md material-icons">file_upload</i> Edit Cover
      </Dropzone>
    </div>);
  } else {
    dropZone = (<div className="avatar">
      <img alt="Profile" src={`https://img.busy6.com/@${props.username}`} />
    </div>);
  }

  if (props.onDelete) {
    deleteBtn = (<a
      style={{ position: 'absolute', right: 20, top: 70 }}
      className="icon icon-md material-icons"
      onClick={(event) => { event.preventDefault(); props.onDelete(props.username); return false; }}
    >delete </a>);
  }

  if (props.username) {
    username = <h3> @{props.username}</h3>;
  }

  return (<div className="cover pam" onClick={props.onClick} style={{ backgroundImage: `url(https://img.busy6.com/@${props.username}/cover) !important` }}>
    <a>
      {dropZone}
      {username}
    </a>
    {deleteBtn}
  </div>);
};

EditImageHeader.propTypes = {
  username: PropTypes.string.isRequired,
  onDrop: PropTypes.func,
  onClick: PropTypes.func,
  onDelete: PropTypes.func,
};


export default EditImageHeader;
