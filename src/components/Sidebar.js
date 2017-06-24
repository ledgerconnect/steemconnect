import React from 'react';
import { Menu, Icon } from 'antd';
import { withRouter } from 'react-router';

const SubMenu = Menu.SubMenu;

const Sidebar = ({ router, width, location }) =>
  <Menu
    onClick={item => router.push(item.key)}
    style={{ width }}
    selectedKeys={[location.pathname]}
    defaultOpenKeys={['apps', 'developer']}
    mode="inline"
  >
    <Menu.Item key="/dashboard"><Icon type="area-chart" />Dashboard</Menu.Item>
    <Menu.Item key="/profile"><Icon type="user" />My Profile</Menu.Item>
    <SubMenu key="apps" title={<span><Icon type="appstore" /><span>Apps</span></span>}>
      <Menu.Item key="/apps">All Apps</Menu.Item>
      <Menu.Item key="/apps/authorized">Authorized Apps</Menu.Item>
    </SubMenu>
    <SubMenu key="developer" title={<span><Icon type="code" /><span>Developer</span></span>}>
      <Menu.Item key="/apps/me">My Apps</Menu.Item>
      <Menu.Item key="/docs/oauth2">OAuth2</Menu.Item>
    </SubMenu>
  </Menu>;

export default withRouter(Sidebar);
