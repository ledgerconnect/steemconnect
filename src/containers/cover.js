const React = require('react'),
    Dropzone = require('react-dropzone');

module.exports = (props) => {
    let avatar = '//img.busy6.com/@' + props.username + '?cb=' + Math.floor(Math.random() * 10000000000);
    let cover = '//img.busy6.com/@' + props.username + '/cover?cb=' + Math.floor(Math.random() * 10000000000);
    return (props.onDrop) ?
        <div className="cover" style={{ backgroundImage: 'url(' + cover + ')' }}>
            <Dropzone className="avatar" onDrop={(files) => props.onDrop(files, 'profile_image') } accept='image/*'>
                <a className="placeholder"><i className="icon icon-md material-icons">file_upload</i> Edit</a>
                <img src={avatar}/>
            </Dropzone>
            <Dropzone className='x' onDrop={(files) => props.onDrop(files, 'cover_image') } accept='image/*'><i className="icon icon-md material-icons">file_upload</i> Edit Cover</Dropzone>
        </div> :
        <div onClick={props.onClick} className="cover" style={{ backgroundImage: 'url(' + cover + ')' }}>
            <div className="avatar">
                <img src={avatar}/>
            </div>
            {props.username && <h1>{props.username}</h1>}
        </div>
};