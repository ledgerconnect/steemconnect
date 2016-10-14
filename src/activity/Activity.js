import React, { Component, PropTypes } from 'react';
import Header from './../app/header';

class Activity extends Component {
  render() {
    return (
      <div>
        <Header />

        <section className="align-center profile-header">
          <div className="container">
            <h1>
              Activity
            </h1>
            <span>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </span>
          </div>
        </section>
        <ul className="secondary-nav mbl">
          <li>
            <a href="#">
              <i className="icon icon-md material-icons">event</i>
              <span className="hidden-xs"> All Activity</span>
            </a>
          </li>
          <li>
            <a href="#">
              <i className="icon icon-md material-icons">chat_bubble_outline</i>
              <span className="hidden-xs"> Blog</span>
            </a>
          </li>
          <li>
            <a href="#">
              <i className="icon icon-md material-icons">compare_arrows</i>
              <span className="hidden-xs"> Transfers</span>
            </a>
          </li>
          <li>
            <a href="#">
              <i className="icon icon-md material-icons">save</i>
              <span className="hidden-xs"> Account Update</span>
            </a>
          </li>
        </ul>

        <div className="container">
          <div className="block block-activity">
            <ul className="list list-activity">
              <li className="list-element pas">
                <div className="list-container">
                  <h3 className="list-title man">Upvote</h3>
                  <span className="list-description">For "New Advanced Formatting Features" by @dan</span>
                </div>
                <span className="list-date">28 September</span>
              </li>
              <li className="list-element pas">
                <div className="list-container">
                  <h3 className="list-title man">Post</h3>
                  <span className="list-description">Oslo Steemit hackaton with Ned Scott</span>
                </div>
                <span className="list-date">today</span>
              </li>
              <li className="list-element pas">
                <div className="list-container">
                  <h3 className="list-title man">Transfer of 120.000 STEEM</h3>
                  <span className="list-description">To @dan</span>
                </div>
                <span className="list-date">today</span>
              </li>
              <li className="list-element pas">
                <div className="list-container">
                  <h3 className="list-title man">Upvote</h3>
                  <span className="list-description">For "It's time for a Steem Bounty System!" by @ned</span>
                </div>
                <span className="list-date">today</span>
              </li>
              <li className="list-element pas">
                <div className="list-container">
                  <h3 className="list-title man">Transfer of 56.00 SBD</h3>
                  <span className="list-description">To @jesf</span>
                </div>
                <span className="list-date">today</span>
              </li>
            </ul>
            <div className="list-more pas">
              <a href="#">See more</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Activity;
