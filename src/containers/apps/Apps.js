import { bindActionCreators } from 'redux';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Header from '../../app/header';

class Apps extends Component {
  render() {
    const { accountHistory } = this.props.auth.user;
    return (
      <div>
        <Header />
        Apps Placeholder
        <div className="block block-dashboard">
          <ul className="list list-dashboard">
            <li className="list-element">
              <img src="#" alt="asd "className="list-image mrs" />
              <strong className="list-title">Some text</strong>
              <span className="list-description pls">Lorem ipsum dolor sit amet, consectetur adipisicing elit</span>
              <i className="icon icon-md material-icons list-icon">keyboard_arrow_right</i>
            </li>
            <li className="list-element">
              <img src="#" alt="asd" className="list-image mrs" />
              <strong className="list-title">Some text</strong>
              <span className="list-description pls">Lorem ipsum dolor sit amet, consectetur adipisicing elit</span>
              <i className="icon icon-md material-icons list-icon">keyboard_arrow_right</i>
            </li>
          </ul>
        </div>

        
        <div className="block block-dashboard">
          <ul className="list list-dashboard">
            <li className="list-element">
              <img src="#" alt="asd "className="list-image mrs" />
              <strong className="list-title">Some text</strong>
              <span className="list-description pls">Lorem ipsum dolor sit amet, consectetur adipisicing elit</span>
              <i className="icon icon-md material-icons list-icon">keyboard_arrow_right</i>
            </li>
            <li className="list-element">
              <img src="#" alt="asd" className="list-image mrs" />
              <strong className="list-title">Some text</strong>
              <span className="list-description pls">Lorem ipsum dolor sit amet, consectetur adipisicing elit</span>
              <i className="icon icon-md material-icons list-icon">keyboard_arrow_right</i>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

Apps.propTypes = {
  auth: PropTypes.shape({
    user: PropTypes.object.isRequired,
  })
};

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Apps);
