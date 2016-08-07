var React = require('react');

module.exports = React.createClass({
  render: function() {
      return (
        <div className="app-wrapper">
          {this.props.children}
        </div>
      );
  }
});