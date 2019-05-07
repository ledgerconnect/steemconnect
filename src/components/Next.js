import React from 'react';
import './Next.less';

const Next = () =>
  <a
    href={
      (window.location.href)
        .replace('http://localhost:3000', 'https://beta.steemconnect.com')
        .replace('https://app.steemconnect.com', 'https://beta.steemconnect.com')
        .replace('https://steemconnect.com', 'https://beta.steemconnect.com')
    }
    className="top-banner"
  >
    Try this page on SteemConnect beta new interface
  </a>;

export default Next;
