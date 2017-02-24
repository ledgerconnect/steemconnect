
import React, { PropTypes } from 'react';
import Link from 'react-router/lib/Link';
import 'shared-styles/antd.css';

function App({ children }) {
  return (
    <div>
        <Link to="/">Home</Link>
        <Link to="/tools">Tools</Link>
        <hr/>
        <div>
            {children}
        </div>
    </div>
  );
}

App.propTypes = {
  children: PropTypes.node,
};

export default App;
