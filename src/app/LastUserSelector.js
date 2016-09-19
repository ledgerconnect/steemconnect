const React = require('react'),
    {Link, withRouter} = require('react-router'),
    _ = require('lodash'),
    EditImageHeader = require('./../header/EditImageHeader'),
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
    onDelete: function (username) {
        let {lastUserList} = this.state;
        let index = lastUserList.indexOf(username);
        if (index >= 0)
            lastUserList.splice(index, 1);

        this.setState({ lastUserList });
        cookie.save(lastUserList, 'last_users');
    },
    selectUser: function (username) {
        let {lastUserList} = this.state;
        let index = lastUserList.indexOf(username);
        if (index >= 0)
            this.props.router.push('/login/' + username);
    },
    render: function () {
        let {lastUserList} = this.state;
        return <div className="block">
            {lastUserList.map((username, index) => {
                return <EditImageHeader key={index} onClick={() => { this.selectUser(username) } } username={username} onDelete={ this.onDelete }/>
            }) }
            <form className="form pvx mhl">
                <fieldset className="form-group">
                  <input autoFocus type="text" placeholder="Username" className="form-control form-control-lg" ref="username" />
                </fieldset>
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
