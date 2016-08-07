var axios = require('axios'),
	moment = require('moment'),
	C = require('./constants');

module.exports = {
	refresh: function(a) {
		return function(dispatch, getState) {
			dispatch({type:C.REFRESH});
		};
	}
};