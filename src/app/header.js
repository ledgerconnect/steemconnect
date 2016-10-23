import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { hideSidebar, showSidebar } from './appAction';

const Header = props => <header>
  <div className="top-nav">
    <div className="section-content">
      <Link to="/" onlyActiveOnIndex activeClassName="active"><img alt="logo" className="logo" src="/img/logo.svg" /></Link>
    </div>
  </div>
</header>;

Header.propTypes = {
  app: PropTypes.shape({
    sidebarIsVisible: PropTypes.bool,
  }),
  hideSidebar: PropTypes.func,
};

const mapStateToProps = state => ({
  app: state.app,
  auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
  showSidebar() { dispatch(showSidebar()); },
  hideSidebar() { dispatch(hideSidebar()); },
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
