import React from 'react';
import { Layout } from 'antd';
import Header from './widgets/Header';

const App = () => (
  <Layout>
    <Layout.Header style={{ borderBottom: '1px solid #E9E7E7' }}>
      <Header username={this.props.auth.user.name} />
    </Layout.Header>
    <Layout.Content>
      {React.cloneElement(
        this.props.children,
        { auth: this.props.auth }
      )}
    </Layout.Content>
  </Layout>
);

export default App;
