import { hideSidebar, showSidebar } from './../actions';

let React = require('react'),
  ReactRedux = require('react-redux'),
  Link = require('react-router').Link;

const Header = React.createClass({
  render() {
    return (
      <header>
        <div className="top-nav">
          {!this.props.app.sidebarIsVisible && <a onClick={() => this.props.showSidebar()}><i className="icon icon-md icon-menu material-icons">menu</i></a>}
          {this.props.app.sidebarIsVisible && <a onClick={() => this.props.hideSidebar()}><i className="icon icon-md icon-menu material-icons">keyboard_backspace</i></a>}
          <div className="section-content">
            <Link to="/" onlyActiveOnIndex activeClassName="active"><img className="logo" src="/img/logo.svg" /></Link>
          </div>
          <a><i className="icon icon-md icon-menu material-icons">notifications</i></a>
        </div>
      </header>
    );
  },
});

const mapStateToProps = function (state) {
  return {
    app: state.app,
    auth: state.auth,
  };
};

const mapDispatchToProps = function (dispatch) {
  return {
    showSidebar() { dispatch(showSidebar()); },
    hideSidebar() { dispatch(hideSidebar()); },
  };
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Header);
