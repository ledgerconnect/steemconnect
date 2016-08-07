var React = require("react"),
	Link = require("react-router").Link;

module.exports = React.createClass({
	render: function(){
		return (
			<header>
				<div className="top-nav">
					<a className="visible-xs" href="#" onClick={() => ''}><i className="icon icon-md icon-menu material-icons">menu</i></a>
					<a className="hidden-xs" href="#" onClick={() => ''}><i className="icon icon-md icon-menu material-icons">arrow_back</i></a>
					<div className="section-content top-head"></div>
					<a href="#"><i className="icon icon-md icon-menu material-icons">add</i></a>
				</div>
			</header>
		);
	}
});