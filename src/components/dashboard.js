const React = require('react'),
	ReactRedux = require('react-redux'),
	Header = require('./../containers/header'),
	actions = require('../actions'),
	moment = require('moment'),
	_ = require('lodash'),
	{formatter} = require('steem'),
	{Link} = require('react-router');

class Dashboard extends React.Component {
	componentDidMount() {
		this.props.getAccountHistory(this.props.auth.user.name, -1, 5);
	}
	render() {
		let {reputation, name, accountHistory} = this.props.auth.user;
		return (
			<div className="main-panel">
				<div className="view-app">
					<div className="block">
						<div className="cover">
							<div className="avatar">
								<img src={`https://img.busy6.com/@${name}`} />
							</div>
							{reputation && <div>{formatter.reputation(reputation)}</div>}
						</div>
						<Header />
						<div className="pvl mhl">
							{accountHistory && <h2>Last Activity</h2>}
							{accountHistory && _.sortBy(accountHistory, 'timestamp').reverse().map(([id, transaction]) =>
								<Activity key={id} id={id} transaction={transaction}/>)}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const Activity = ({id, transaction}) => {
	let {op, timestamp} = transaction;
	let [name, details] = op;
	let label = name.replace('account_update', 'Account Update').replace('vote', 'Vote');
	if (name == 'vote') {
		return <p key={id}>{label} for <a href="#" target="_blank">@{details.author}/{details.permlink}</a> {moment(timestamp).fromNow()}</p>;
	} else if (_.includes(['account_update', 'vote'], name)) {
		return <p key={id}>{label} {moment(timestamp).fromNow()}</p>;
	} else {
		return null;
	}
};

var mapStateToProps = function (state) {
	return { auth: state.auth };
};

var mapDispatchToProps = function (dispatch) {
	return {
		getAccountHistory: (username, from, limit) => dispatch(actions.getAccountHistory(username, from, limit))
	}
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Dashboard);