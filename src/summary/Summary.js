import React from 'react';
import { Link } from 'react-router';

module.exports = React.createClass({
  render() {
    return (
      <div className="container">
        <h1 className="mvl">Welcome!</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla.</p>
        <div className="row">
          <div className="col col-md-4">
            <i className="icon icon-xl material-icons">perm_identity</i>
            <h2><Link to="/profile">Profile</Link></h2>
            <p>Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis.</p>
          </div>
          <div className="col col-md-4">
            <i className="icon icon-xl material-icons">credit_card</i>
            <h2><Link to="/payments">Payments</Link></h2>
            <p>Sed lectus. Integer euismod lacus luctus magna. Quisque cursus, augue eget diam.</p>
          </div>
          <div className="col col-md-4">
            <i className="icon icon-xl material-icons">apps</i>
            <h2><Link to="/apps">App Store</Link></h2>
            <p>Morbi in dui quis est pulvinar ullamcorper. Nulla facilisi. Integer lacinia Cras metus.</p>
          </div>
        </div>
      </div>
    );
  }
});
