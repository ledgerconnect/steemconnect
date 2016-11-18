import React, { Component } from 'react';

class TutorialsSimpleApp extends Component {
  constructor(props) {
    super(props);
    this.state = { error: {}, creatingNewApp: false };
    this.formFields = { permissions: {} };
    this.formData = {};
  }

  render() {
    return (
      <div>
        <div className="pbxl">
          <div className="container pvxl">
            <h1>Tutorial: Create a simple app on Steem blockchain</h1>
            <h3>In this tutorial we will create a simple application using Steem Connect to post comment on Steem blockchain.</h3>
          </div>
          <div className="row pvl thin text-lg-left">
            <div className="pvl">
              <h3>Requirements</h3>
              <p>Curabitur tortor. Pellentesque nibh. Aenean quam.
                In scelerisque sem at dolor. Maecenas mattis.</p>
              <a href="https://steemit.com/create_account" className="btn btn-primary">Create an account</a>
            </div>
            <div className="pvl">
              <h3><span className="tag tag-pill tag-default">1</span> Download Steem Connect JavaScript SDK</h3>
              <p>Curabitur tortor. Pellentesque nibh. Aenean quam.
                In scelerisque sem at dolor. Maecenas mattis.</p>
              <a href="https://raw.githubusercontent.com/adcpm/steemconnect/dev/dist/steemconnect.min.js" className="btn btn-primary">Download</a>
            </div>
            <div className="pvl">
              <h3><span className="tag tag-pill tag-default">2</span> Download Steem Connect JavaScript SDK</h3>
              <p>Curabitur tortor. Pellentesque nibh. Aenean quam.
                In scelerisque sem at dolor. Maecenas mattis.</p>
              <a href="https://raw.githubusercontent.com/adcpm/steemconnect/dev/dist/steemconnect.min.js" className="btn btn-primary">Download</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TutorialsSimpleApp;
