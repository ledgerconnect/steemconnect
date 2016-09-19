const React = require('react');
const ReactRedux = require('react-redux');

const Dashboard = React.createClass({
  propTypes: {
    params: React.PropTypes.shape({ app: React.PropTypes.string.isRequired }),
    location: React.PropTypes.shape({ query: React.PropTypes.object.isRequired }),
    auth: React.PropTypes.shape({ user: React.PropTypes.object.isRequired }),
  },
  render() {
    const appName = this.props.params.app;
    const { appAuthor, clientId, redirect_url, scope } = this.props.location.query;
    let message;
    if (!clientId || !redirect_url) {
      message = <div>Missing ClientId or redirect_url</div>;
    }
    return (
      <div className="block">
        <div className="mbl"><img src={`https://img.busy6.com/@${appName}`} width="70" /></div>
        {message ? message :
          <div>
            <p>The app <b>{appName}</b> is requesting permission to do the following: </p>
            <ul className="mbm">
              <li><i className="icon icon-sm material-icons">check_box</i> Verify your identity</li>
            </ul>
            <a href={`/auth/authorize?clientId=${clientId}&redirect_url=${redirect_url}&appUserName=${appName}&scope=${scope}`} className="btn btn-primary mbm" ref="body">Continue as @{this.props.auth.user.name}</a>
          </div>
        }
      </div>
    );
  },
});

const mapStateToProps = function (state) {
  return { auth: state.auth };
};

module.exports = ReactRedux.connect(mapStateToProps)(Dashboard);
