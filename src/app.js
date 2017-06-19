import React, { Component } from 'react';
import { Layout } from 'antd';
import Header from './widgets/Header';
import Sidebar from './components/Sidebar';

export const SIDEBAR_WIDTH = 200;
export default class App extends Component {
  render() {
    return (
      <Layout>
        <Layout.Header style={{ borderBottom: '1px solid #E9E7E7' }}>
          <Header username={this.props.auth.user.name} />
        </Layout.Header>
        <Layout style={{ maxWidth: '990px', margin: '1em auto' }}>
          <Layout.Sider
            breakpoint="sm"
            collapsedWidth="0"
            style={{ background: 'transparent' }}
            width={SIDEBAR_WIDTH}
          >
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
