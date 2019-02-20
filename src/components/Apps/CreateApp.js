import React from 'react';
import { FormattedMessage } from 'react-intl';

const CreateApp = () =>
  <div className="container py-5">
    <h1><FormattedMessage id="new_apps" /></h1>
    <div className="block py-4">
      <p>
        To create an application on SteemConnect you can use an existing Steem account or
        create a new one. When you have an account you can go on the url
        <b> https://steemconnect.com/apps/@username/edit</b> and change "@username" with
        the name of your account to init the application.
      </p>
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
