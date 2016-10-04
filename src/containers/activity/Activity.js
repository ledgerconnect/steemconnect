import { bindActionCreators } from 'redux';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Header from '../../app/header';

class Activity extends Component {
  render() {
    const { accountHistory } = this.props.auth.user;
    return (
      <div>
        <Header />
        Activity Placeholder
      </div>
    );
  }
}

Activity.propTypes = {
  auth: PropTypes.shape({
    user: PropTypes.object.isRequired,
  })
};

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Activity);
