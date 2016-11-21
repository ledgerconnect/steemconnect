import React, { Component } from 'react';
import { Link } from 'react-router';

export default class Summary extends Component {
  render() {
    return (
      <div>
        <div className="pvxl">
          <h1><Link to="/profile">Control your public identity</Link></h1>
          <h3>Integrate identity architecture early,
            saving critical time and ensuring security.</h3>
        </div>
        <div className="pvxl">
          <h1><Link to="/developers">Build your apps on Steem blockchain</Link></h1>
          <h3>Integrate identity architecture early,
            saving critical time and ensuring security.</h3>
        </div>
      </div>
    );
  }
}
