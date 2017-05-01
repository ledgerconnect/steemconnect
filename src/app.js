import React, { Component } from 'react';
import Header from './widgets/Header';

export default class App extends Component {
  render() {
    return (
      <div>
        <Header username={this.props.app.user.name} />
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
