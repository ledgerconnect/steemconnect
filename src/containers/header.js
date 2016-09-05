var React = require('react'),
	Link = require('react-router').Link;

module.exports = React.createClass({
	render: function(){
		return (
			<header>
				<ul className="app-nav">
					<li><Link to="/" onlyActiveOnIndex={true} activeClassName="active"><i className="icon icon-md material-icons">account_box</i><span className="hidden-xs"> Dashboard</span></Link></li>
					<li><Link to="/profile" onlyActiveOnIndex={true} activeClassName="active"><i className="icon icon-md material-icons">person</i><span className="hidden-xs"> Profile</span></Link></li>
					{/*<li><Link to="/apps"><i className="icon icon-md material-icons">web</i><span className="hidden-xs"> Apps</span></Link></li>*/}
					{/*<li><Link to="/developers" activeClassName="active"><i className="icon icon-md material-icons">code</i><span className="hidden-xs"> Developers</span></Link></li>*/}
					{/*<li><Link to="/about" activeClassName="active"><i className="icon icon-md material-icons">info_outline</i><span className="hidden-xs"> About</span></Link></li>*/}
					<li><Link to="/logout"><i className="icon icon-md material-icons">lock_open</i><span className="hidden-xs"> Log Out</span></Link></li>
				</ul>
			</header>
		);
	}
});