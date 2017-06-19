import React, { Component } from 'react';
import { Layout } from 'antd';
import Header from './widgets/Header';
import Sidebar from './components/Sidebar';

export const SIDEBAR_WIDTH = 240;
export default class App extends Component {
  render() {
    return (
      <Layout>
        <Layout.Header style={{ borderBottom: '1px solid #E9E7E7' }}>
          <Header username={this.props.auth.user.name} />
        </Layout.Header>
        <Layout>
          <Layout.Sider breakpoint="sm" collapsedWidth="0" width={SIDEBAR_WIDTH}>
            <Sidebar width={SIDEBAR_WIDTH} />
          </Layout.Sider>
          <Layout.Content>
            {React.cloneElement(this.props.children, { auth: this.props.auth })}
          </Layout.Content>
        </Layout>
      </Layout>
    );
  }
}
