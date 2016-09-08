const React = require('react'),
    Dropzone = require('react-dropzone');

module.exports = (props) => {
    return (props.onDrop)?
        <div className="cover" style={{backgroundImage: 'url(' + props.cover + ')'}}>
            <Dropzone className="avatar" onDrop={(files) => props.onDrop(files, 'profile_image') } accept='image/*'>
            <a className="placeholder"><i className="icon icon-md material-icons">file_upload</i> Edit</a>
            <img src={props.avatar}/>
            </Dropzone>
            <Dropzone className='x' onDrop={(files) => props.onDrop(files, 'cover_image') } accept='image/*'><i className="icon icon-md material-icons">file_upload</i> Edit Cover</Dropzone>
        </div> :
        <div className="cover" style={{backgroundImage: 'url(' + props.cover + ')'}}>
            <div className="avatar">
                <img src={props.avatar}/>
            </div>
        </div>
};