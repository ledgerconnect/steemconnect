/* eslint-disable react/prefer-stateless-function,class-methods-use-this */
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

  componentWillMount() {
    document.getElementById('app').style.background = '#f0f2f4';
  }

  getActiveKey = () => this.props.location.pathname;

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
      (auth.isAuthenticated &&
      <Layout>
        <Header>
          <HeaderWidget username={this.props.auth.user.name} />
        </Header>
        <Content style={{ width: '1080px', margin: '0 auto' }}>
          <Layout>
            <Sider
              width={250}
            >
              <Menu
                mode="inline"
                defaultSelectedKeys={[activeKey]}
                defaultOpenKeys={[this.getSubMenu(activeKey)]}
                style={{ height: '100%', borderRight: 0 }}
              >
                <Menu.Item key="/">
                  <Link to="/">
                    <object data={`/img/menu/dashboard${this.isSelected('/dashboard') ? '-selected' : ''}.svg`} type="image/svg+xml" className="menu-icon" />
                    <FormattedMessage id="dashboard" />
                  </Link>
                </Menu.Item>
                <SubMenu key="/apps" title={<span className="sc-submenu"><object data={`/img/menu/apps${this.isSelected('/apps') ? '-selected' : ''}.svg`} type="image/svg+xml" className="menu-icon" /><FormattedMessage id="applications" /></span>}>
                  <Menu.Item key="/apps"><Link to="/apps"><FormattedMessage id="apps" /></Link></Menu.Item>
                  <Menu.Item key="/apps/authorized"><Link to="/apps/authorized"><FormattedMessage id="authorized_apps" /></Link></Menu.Item>
                </SubMenu>
                <SubMenu key="/developers" title={<span className="sc-submenu"><object data={`/img/menu/developers${this.isSelected('/developers') ? '-selected' : ''}.svg`} type="image/svg+xml" className="menu-icon" /><FormattedMessage id="developers" /></span>}>
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
      </Layout>) ||
      React.cloneElement(
        children,
        { auth }
      )
    );
  }
}
