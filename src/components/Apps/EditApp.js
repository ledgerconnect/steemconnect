import React, { Component, PropTypes } from 'react';
import { injectIntl } from 'react-intl';
import AppForm from './AppForm';
import { getApp } from '../../utils/app';
import Loading from '../../widgets/Loading';
import Avatar from '../../widgets/SteemitAvatar';

class EditApp extends Component {
  static propTypes = {
    params: PropTypes.shape({
      clientId: PropTypes.string,
    }),
    auth: PropTypes.shape(),
  };

  constructor(props) {
    super(props);
    this.state = {
      error: false,
      isLoading: false,
      isLoaded: false,
      clientId: this.props.params.clientId,
      app: {},
    };
  }

  componentWillMount() {
    const { clientId } = this.state;
    this.setState({ isLoading: true });

    getApp(clientId).then((app) => {
      this.setState({
        app,
        isLoading: false,
        isLoaded: true,
      });
    });
  }

  submit = (data) => {
    const { clientId } = this.state;
    // eslint-disable-next-line no-console
    console.log('Application edition is temporary disabled', clientId, data);
    // @TODO redirect to hot signing
  };

  render() {
    const { app, clientId, isLoading, isLoaded } = this.state;
    const { auth } = this.props;
    return (
      <div className="container my-5">
        {isLoading && <Loading />}
        {isLoaded &&
          <div>
            <div className="pb-3">
              <Avatar username={clientId} size="80" className="float-left mr-3" />
              <h2 className="d-inline">{clientId}</h2>
              <p>@{clientId}</p>
            </div>
            <AppForm
              username={clientId}
              data={app}
              auth={auth}
              isLoading={isLoading}
              submit={this.submit}
            />
          </div>
        }
      </div>
    );
  }
}

export default injectIntl(EditApp);
