/* eslint-disable react/prefer-stateless-function,class-methods-use-this,jsx-a11y/no-static-element-interactions,max-len */
import React, { PureComponent, PropTypes } from 'react';
import { Link } from 'react-router';
import { Icon } from 'antd';
import { FormattedMessage } from 'react-intl';
import HeaderWidget from './widgets/Header';

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

  constructor(props) {
    super(props);
    this.state = {
      openedMenus: [],
    };
  }

  componentWillMount() {
    document.getElementById('app').style.background = '#f0f2f4';
  }

  getSubMenu = (activeKey) => {
    if (['/apps/authorized'].includes(activeKey)) {
      return '/apps';
    } else if (['/apps/me', '/docs/oauth2'].includes(activeKey)) {
      return '/developers';
    }
    return activeKey;
  }

  getMenuClass = (menu) => {
    const { openedMenus } = this.state;
    if (openedMenus.includes(menu)) {
      return 'sc-submenu opened';
    }
    return 'sc-submenu';
  }

  isSelected = key => this.getSubMenu(this.props.location.pathname) === key;

  toggleMenu = (menu) => {
    const { openedMenus } = this.state;
    let newMenu = openedMenus.slice();
    if (openedMenus.includes(menu)) {
      newMenu = openedMenus.filter(item => item !== menu);
    } else {
      newMenu.push(menu);
    }
    this.setState({ openedMenus: newMenu });
  }

  render() {
    const { children, auth } = this.props;
    const { openedMenus } = this.state;
    return (
      (auth.isAuthenticated &&
      <div className="sc-layout">
        <div className="sc-header">
          <HeaderWidget username={this.props.auth.user.name} />
        </div>
        <div className="sc-content">
          <ul className="sc-side-nav">
            <li className={this.isSelected('/') ? 'active' : ''}>
              <Link to="/" activeClassName="active">
                <span>
                  <object data={`/img/menu/dashboard${this.isSelected('/') ? '-selected' : ''}.svg`} type="image/svg+xml" className="menu-icon" />
                  <FormattedMessage id="dashboard" />
                </span>
              </Link>
            </li>
            <li className={this.isSelected('/apps') ? 'active' : ''}>
              <div className={`sc-submenu${openedMenus.includes('apps') ? ' opened' : ''}`} onClick={() => this.toggleMenu('apps')}>
                <span>
                  <object data={`/img/menu/apps${this.isSelected('/apps') ? '-selected' : ''}.svg`} type="image/svg+xml" className="menu-icon" />
                  <FormattedMessage id="applications" />
                  {(openedMenus.includes('apps') || this.isSelected('/apps')) ? <Icon type="up" /> : <Icon type="down" />}
                </span>
                <ul className={this.getMenuClass('apps')}>
                  <li><Link to="/apps" activeClassName="active"><FormattedMessage id="apps" /></Link></li>
                  <li><Link to="/apps/authorized" activeClassName="active"><FormattedMessage id="authorized_apps" /></Link></li>
                </ul>
              </div>
            </li>
            <li className={this.isSelected('/developers') ? 'active' : ''}>
              <div className={`sc-submenu${openedMenus.includes('developers') ? ' opened' : ''}`} onClick={() => this.toggleMenu('developers')}>
                <span>
                  <object data={`/img/menu/developers${this.isSelected('/developers') ? '-selected' : ''}.svg`} type="image/svg+xml" className="menu-icon" />
                  <FormattedMessage id="developers" />
                  {(openedMenus.includes('developers') || this.isSelected('/developers')) ? <Icon type="up" /> : <Icon type="down" />}
                </span>
                <ul className={this.getMenuClass('developers')}>
                  <li><Link to="/apps/me" activeClassName="active"><FormattedMessage id="my_apps" /></Link></li>
                  <li><Link to="/docs/oauth2" activeClassName="active"><FormattedMessage id="oauth2" /></Link></li>
                </ul>
              </div>
            </li>
          </ul>
          {React.cloneElement(
            children,
            { auth }
          )}
        </div>
      </div>) ||
      React.cloneElement(
        children,
        { auth }
      )
    );
  }
}
