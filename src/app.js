import React, { Component } from 'react';
import Header from './widgets/Header';

export default class App extends Component {
  render() {
    return (
      <div>
        <Header username={this.props.auth.user.name} />
        <div>
          {React.cloneElement(
            this.props.children,
            { auth: this.props.auth }
          )}
        </div>
      </div>
    );
  }
}
