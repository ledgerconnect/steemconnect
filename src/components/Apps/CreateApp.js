import React from 'react';
import { FormattedMessage } from 'react-intl';

const CreateApp = () =>
  <div className="container py-5">
    <h1><FormattedMessage id="new_apps" /></h1>
    <div className="block py-4">
      <p>
        Application are created by updating an account "json_metadata" profile.
        It simply require to set the param "type" with "app" value to enable an app.
      </p>
      <p>
        <b>
          <a
            href="https://github.com/steemscript/steemscript/wiki/Proposal:-open-standard-for-apps"
            rel="noreferrer noopener"
            target="_blank"
          >
             Read more
          </a>
        </b>
      </p>
    </div>
  </div>
;

export default CreateApp;
