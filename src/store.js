var Redux = require("redux"),
	appReducer = require("./reducers/appReducers"),
	authReducer = require("./reducers/authReducers"),
	headerReducer = require("./reducers/headerReducers"),
	pagesReducer = require("./reducers/pagesReducers"),
	initialState = require("./initialstate"),
	thunk = require('redux-thunk').default;

var rootReducer = Redux.combineReducers({
	app: appReducer,
	auth: authReducer,
	header: headerReducer,
	pages: pagesReducer
});

module.exports = Redux.applyMiddleware(thunk)(Redux.createStore)(rootReducer,initialState(), window.devToolsExtension && window.devToolsExtension());
