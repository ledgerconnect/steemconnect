const React = require('react'),
    Dropzone = require('react-dropzone');

module.exports = (props) => <div className="cover">
    <Dropzone className="avatar" onDrop={(files) => props.onDrop(files, 'profile_image') } accept='image/*'>
        <a className="placeholder"><i className="icon icon-md material-icons">file_upload</i> Edit</a>
        <img src={props.avatar}/>
    </Dropzone>
    <Dropzone className='x' onDrop={(files) => props.onDrop(files, 'cover_image') } accept='image/*'><i className="icon icon-md material-icons">file_upload</i> Edit Cover</Dropzone>
</div>