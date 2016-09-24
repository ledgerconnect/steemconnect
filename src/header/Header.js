import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import EditImageHeader from './EditImageHeader';

const Header = props => (
  <header>
    <EditImageHeader username={props.username} onDrop={props.onDrop} />
  </header>
);

Header.propTypes = {
  username: PropTypes.string,
  onDrop: PropTypes.func,
};

const mapStateToProps = state => ({ auth: state.auth });
export default connect(mapStateToProps)(Header);
