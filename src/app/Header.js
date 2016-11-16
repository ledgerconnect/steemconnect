import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { hideSidebar, showSidebar } from './appAction';

const Header = props => <header>
  <div className="top-nav">
    {!props.app.sidebarIsVisible && <a className="left" onClick={() => props.showSidebar()}><i className="icon icon-md icon-menu material-icons">menu</i></a>}
    <div className="section-content">
      <Link to="/" onlyActiveOnIndex activeClassName="active"><img alt="logo" className="logo" src="/img/logo.svg" /></Link>
    </div>
  </div>
</header>;

const mapStateToProps = state => ({
  app: state.app,
  auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
  showSidebar() { dispatch(showSidebar()); },
  hideSidebar() { dispatch(hideSidebar()); },
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
