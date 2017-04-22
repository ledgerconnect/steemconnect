import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from './app/Header';
import { setUsername } from './actions';

@connect(
  state => ({
    app: state.app,
  }),
  dispatch => bindActionCreators({
    setUsername,
  }, dispatch)
)
export default class App extends Component {
  componentWillMount() {
    this.props.setUsername(window.USERNAME);
  }

  render() {
    return (
      <div>
        <Header username={this.props.app.username} />
        <div>
          {React.cloneElement(
            this.props.children,
            { app: this.props.app }
          )}
        </div>
      </div>
    );
  }
}
