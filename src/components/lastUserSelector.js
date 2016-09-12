const React = require('react'),
    {Link, withRouter} = require('react-router'),
    EditImageHeader = require('./../containers/cover'),
    cookie = require('../../lib/cookie');

const LastUserSelector = React.createClass({
    getInitialState: function () {
        let lastUserList = cookie.get('last_users');
        if (!_.isArray(lastUserList))
            lastUserList = [];
        return { lastUserList };
    },
    componentWillMount: function () {
        let {lastUserList} = this.state;
        let {location} = this.props;

        if (location.query.redirect == 'false') {
            return;
        }

        if (lastUserList[0] === undefined) {
            this.props.router.push('/login');
        } else if (lastUserList[0]) {
            this.props.router.push('/login/' + lastUserList[0]);
        }
    },
    render: function () {
        let {lastUserList} = this.state;
        return <div className="block">
            {lastUserList.map((username, index) => {
                return <Link key={index} to={'/login/' + username}>
                    <EditImageHeader username={username} />
                </Link>
            }) }
            <form className="pvx mhl">
                <fieldset className="form-group">
                    <Link to={{ pathname: "/login", query: { redirect: false } }}>
                        <button className="btn btn-secondary">Add Account</button>
                    </Link>
                </fieldset>
            </form>
        </div>
    }
});

module.exports = withRouter(LastUserSelector);