/* eslint-disable react/prefer-stateless-function */
import React, { PureComponent } from 'react';
import { Layout } from 'antd';
import Header from './widgets/Header';

export default class App extends PureComponent {
  render() {
    const { children, auth } = this.props;
    return (
      <Layout>
        <Layout.Header style={{ borderBottom: '1px solid #E9E7E7' }}>
          <Header username={this.props.auth.user.name} />
        </Layout.Header>
        <Layout.Content>
          {React.cloneElement(
            children,
            { auth }
          )}
        </Layout.Content>
      </Layout>
    );
  }
}
