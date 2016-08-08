var React = require("react");

module.exports = React.createClass({
	render: function(){
		return (
			<div className="main-panel">
				<div className="view">
					<img className="logo" src="/img/logo.svg" width="280" />
					<div className="block">
						<div className="thumb"><img src="/img/busy.svg" width="70" /></div>
						<h3>Busy will ...</h3>
						<button className="btn btn-primary" placeholder="Password or WIF" ref="body">Continue as @fabien</button>
					</div>
				</div>
			</div>
		);
	}
});