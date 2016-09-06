const React = require('react'),
	ReactRedux = require('react-redux'),
	Header = require('./../containers/header'),
	actions = require("../actions"),
	steem = require("steem"),
	{Link} = require('react-router');

const Activity = ({id, transaction}) => {
	let {op: operation} = transaction;
	// console.log(transaction, operation);
	let [name, details] = operation;
	// console.log(details);
	return <div key={id}>{name}</div>
}

class Dashboard extends React.Component {
	componentDidMount() {
		this.props.getRecentActivities(this.props.auth.user.name);
	}
	render() {
		let {reputation, name, recentActivities} = this.props.auth.user;
		console.log('recentActivities', recentActivities);
		return (
			<div className="main-panel">
				<Header />
				<div className="view-app">
					<div className="block">
						<div className="avatar">
							{reputation && <div>{steem.formatter.reputation(reputation) }</div>}
							<img src={`https://img.busy6.com/@${name}`} />
						</div>
						<h1> @{name}</h1>
						<div>
							{recentActivities && recentActivities.map(([id, transaction]) => <Activity key={id} id={id} transaction={transaction}/>)}
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
		getRecentActivities: (username) => dispatch(actions.getRecentActivities(username))
	}
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Dashboard);