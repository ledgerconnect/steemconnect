import EditImageHeader from './EditImageHeader';

var React = require('react'),
  ReactRedux = require('react-redux'),
  {Link} = require('react-router');

var Header = React.createClass({
  render: function () {
    return (
      <header>
        <EditImageHeader username={this.props.username} onDrop={this.props.onDrop} />
        <ul className="app-nav">
          <li><Link to="/" onlyActiveOnIndex={true} activeClassName="active"><i className="icon icon-md material-icons">track_changes</i><span className="hidden-xs"> Dashboard</span></Link></li>
          <li><Link to="/profile" onlyActiveOnIndex={true} activeClassName="active"><i className="icon icon-md material-icons">settings</i><span className="hidden-xs"> Settings</span></Link></li>
          {/*<li><Link to="/apps"><i className="icon icon-md material-icons">web</i><span className="hidden-xs"> Apps</span></Link></li>*/}
          {/*<li><Link to="/developers" activeClassName="active"><i className="icon icon-md material-icons">code</i><span className="hidden-xs"> Developers</span></Link></li>*/}
          {/*<li><Link to="/about" activeClassName="active"><i className="icon icon-md material-icons">info_outline</i><span className="hidden-xs"> About</span></Link></li>*/}
        </ul>
      </header>
    );
  }
});

var mapStateToProps = function (state) {
  return { auth: state.auth };
};

module.exports = ReactRedux.connect(mapStateToProps)(Header);
