/* eslint-disable class-methods-use-this */
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { logout } from './authAction';

class Logout extends Component {
  componentWillMount() {
    this.props.logout();
    this.props.router.replace('/');
  }

  render() {
    return null;
  }
}
Logout.propTypes = {
  logout: PropTypes.func,
  router: PropTypes.shape({
    replace: PropTypes.func,
  }),
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  logout() { dispatch(logout()); },
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Logout));
