/* eslint-disable react/prefer-stateless-function */
import React, { PureComponent, PropTypes } from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { Layout, Menu } from 'antd';
import HeaderWidget from './widgets/Header';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

export default class App extends PureComponent {
  static propTypes = {
    children: PropTypes.shape(),
    auth: PropTypes.shape({
      user: PropTypes.shape({
        name: PropTypes.string,
      }),
    }),
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }),
  }

  getActiveKey = () => {
    switch (this.props.location.pathname) {
      case '/apps/authorized':
        return '/apps';
      case '/apps/me':
        return '/developers';
      case '/docs/oauth2':
        return '/developers';
      default:
        return this.props.location.pathname;
    }
  }

  getSubMenu = (activeKey) => {
    if (['/apps/authorized'].includes(activeKey)) {
      return '/apps';
    } else if (['/apps/me', '/docs/oauth2'].includes(activeKey)) {
      return '/developers';
    }
    return activeKey;
  }

  isSelected = key => this.getSubMenu(this.props.location.pathname) === key;

  render() {
    const { children, auth } = this.props;
    const activeKey = this.getActiveKey();
    return (
      <Layout>
        <Header style={{ borderBottom: '1px solid #E9E7E7' }}>
          <HeaderWidget username={this.props.auth.user.name} />
        </Header>
        <Content style={{ width: '860px', margin: '0 auto' }}>
          <Layout>
            <Sider style={{ background: '#fcfcfc' }}>
              <Menu
                mode="inline"
                defaultSelectedKeys={[activeKey]}
                defaultOpenKeys={[this.getSubMenu(activeKey)]}
                style={{ height: '100%', borderRight: 0 }}
              >
                <Menu.Item key="/dashboard">
                  <Link to="/dashboard">
                    <object data={`/img/menu/dashboard${this.isSelected('/dashboard') ? '-selected' : ''}.svg`} type="image/svg+xml" className="menu-icon" />
                    <FormattedMessage id="dashboard" />
                  </Link>
                </Menu.Item>
                <SubMenu key="/apps" title={<span><object data={`/img/menu/apps${this.isSelected('/apps') ? '-selected' : ''}.svg`} type="image/svg+xml" className="menu-icon" /><FormattedMessage id="applications" /></span>}>
                  <Menu.Item key="/apps"><Link to="/apps"><FormattedMessage id="apps" /></Link></Menu.Item>
                  <Menu.Item key="/apps/authorized"><Link to="/apps/authorized"><FormattedMessage id="authorized_apps" /></Link></Menu.Item>
                </SubMenu>
                <Menu.Item key="/wallet">
                  <Link to="/wallet">
                    <object data={`/img/menu/wallet${this.isSelected('/wallet') ? '-selected' : ''}.svg`} type="image/svg+xml" className="menu-icon" />
                    <FormattedMessage id="wallet" />
                  </Link>
                </Menu.Item>
                <Menu.Item key="/activity">
                  <Link to="/activity">
                    <object data={`/img/menu/activity${this.isSelected('/activity') ? '-selected' : ''}.svg`} type="image/svg+xml" className="menu-icon" />
                    <FormattedMessage id="activity" />
                  </Link>
                </Menu.Item>
                <SubMenu key="/developers" title={<span><object data={`/img/menu/developers${this.isSelected('/developers') ? '-selected' : ''}.svg`} type="image/svg+xml" className="menu-icon" /><FormattedMessage id="developers" /></span>}>
                  <Menu.Item key="/apps/me"><Link to="/apps/me"><FormattedMessage id="my_apps" /></Link></Menu.Item>
                  <Menu.Item key="/docs/oauth2"><Link to="/docs/oauth2"><FormattedMessage id="oauth2" /></Link></Menu.Item>
                </SubMenu>
              </Menu>
            </Sider>
            {React.cloneElement(
              children,
              { auth }
            )}
          </Layout>
        </Content>
      </Layout>
    );
  }
}
