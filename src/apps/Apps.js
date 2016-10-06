import React, { Component } from 'react';
import Header from './../app/header';

class Apps extends Component {
  render() {
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

export default Apps;
