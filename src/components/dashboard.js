const React = require('react'),
	ReactRedux = require('react-redux'),
	Header = require('./../containers/header'),
	actions = require('../actions'),
	moment = require('moment'),
	{formatter} = require('steem'),
	{Link} = require('react-router');

const Activity = ({id, transaction}) => {
	let {op, timestamp} = transaction;
	let [name, details] = op;
	name = name.replace('account_update', 'Account Update')
			.replace('vote', 'Vote');
	return <p key={id}>{name} {moment(timestamp).fromNow()}</p>
};

class Dashboard extends React.Component {
	componentDidMount() {
		this.props.getAccountHistory(this.props.auth.user.name, -1, 10);
	}
	render() {
		let {reputation, name, accountHistory} = this.props.auth.user;
		console.log('recentActivities', accountHistory);
		return (
			<div className="main-panel">
				<Header />
				<div className="view-app">
					<div className="block">
						<div className="cover">
							<div className="avatar">
								{reputation && <div>{formatter.reputation(reputation) }</div>}
								<img src={`https://img.busy6.com/@${name}`} />
							</div>
						</div>
						<h1>@{name}</h1>
						<div>
							{accountHistory && <h2>Last Activity</h2>}
							{accountHistory && accountHistory.reverse().map(([id, transaction]) =>
								<Activity key={id} id={id} transaction={transaction}/>)}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

var mapStateToProps = function (state) {
	return { auth: state.auth };
};

var mapDispatchToProps = function (dispatch) {
	return {
		getAccountHistory: (username, from, limit) => dispatch(actions.getAccountHistory(username, from, limit))
	}
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Dashboard);