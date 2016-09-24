var React = require('react'),
  ReactRedux = require('react-redux'),
  actions = require('./../actions'),
  Link = require('react-router').Link;

var Header = React.createClass({
  render() {
    return (
      <header>
        <div className="top-nav">
          {!this.props.app.sidebarIsVisible && <a onClick={() => this.props.showSidebar()}><i className="icon icon-md icon-menu material-icons">menu</i></a>}
          {this.props.app.sidebarIsVisible && <a onClick={() => this.props.hideSidebar()}><i className="icon icon-md icon-menu material-icons">keyboard_backspace</i></a>}
          <div className="section-content">
            <Link to="/" onlyActiveOnIndex={true} activeClassName="active"><img className="logo" src="/img/logo.svg" /></Link>
          </div>
          <a><i className="icon icon-md icon-menu material-icons">notifications</i></a>
        </div>
      </header>
    );
  }
});

var mapStateToProps = function(state){
  return {
    app: state.app,
    auth: state.auth
  };
};

var mapDispatchToProps = function(dispatch){
  return {
    showSidebar: function(){ dispatch(actions.showSidebar()); },
    hideSidebar: function(){ dispatch(actions.hideSidebar()); }
  }
};

module.exports = ReactRedux.connect(mapStateToProps,mapDispatchToProps)(Header);
