var Redux = require("redux"),
	appReducer = require("./app/appReducers"),
	authReducer = require("./auth/authReducers"),
	headerReducer = require("./header/headerReducers"),
	thunk = require('redux-thunk').default;

var rootReducer = Redux.combineReducers({
	app: appReducer,
	auth: authReducer,
	header: headerReducer,
	//pages: pagesReducer
});

module.exports = Redux.applyMiddleware(thunk)(Redux.createStore)(rootReducer,{}, window.devToolsExtension && window.devToolsExtension());
