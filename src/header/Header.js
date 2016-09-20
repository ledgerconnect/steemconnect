import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import EditImageHeader from './EditImageHeader';

const Header = props => (
  <header>
    <EditImageHeader username={props.username} onDrop={props.onDrop} />
    <ul className="app-nav">
      <li><Link to="/" onlyActiveOnIndex activeClassName="active"><i className="icon icon-md material-icons">track_changes</i><span className="hidden-xs"> Dashboard</span></Link></li>
      <li><Link to="/profile" onlyActiveOnIndex activeClassName="active"><i className="icon icon-md material-icons">settings</i><span className="hidden-xs"> Settings</span></Link></li>
      <li><Link to="/developers" activeClassName="active"><i className="icon icon-md material-icons">code</i><span className="hidden-xs"> Developers</span></Link></li>
    </ul>
  </header>
);

Header.propTypes = {
  username: PropTypes.string,
  onDrop: PropTypes.func,
};

const mapStateToProps = state => ({ auth: state.auth });
export default connect(mapStateToProps)(Header);
