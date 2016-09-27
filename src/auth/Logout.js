import { logout } from '../actions';

const React = require('react');
const ReactRedux = require('react-redux');
const withRouter = require('react-router').withRouter;

const Logout = React.createClass({
  componentWillMount() {
    this.props.logout();
    this.props.router.replace('/');
  },
  render() {
    return null;
  },
});

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  logout() { dispatch(logout()); },
});

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(withRouter(Logout));
