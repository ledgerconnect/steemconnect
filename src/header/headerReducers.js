import * as headerTypes from './headerActionTypes';

const initialState = {
  menu: 'primary',
  tabs: [],
  query: '',
};

module.exports = function(state = initialState, action){
	switch(action.type){
		case headerTypes.SEARCH:
			return Object.assign({}, state, {
				query: action.query
			});
		case headerTypes.SET_MENU:
			return Object.assign({}, state, {
				menu: action.menu
			});
    // TODO(p0o): serious anti-pattern - avoid mutating redux state
    // Lines commented in case there is a need for refactor
    /*
		case headerTypes.TAB_CREATE:
			state.tabs.push(action.page);
			return state;
		case headerTypes.TAB_DELETE:
			if(state.tabs.indexOf(action.page) != -1) {
				delete state.tabs[state.indexOf(action.page)];
			}
			return state;
			*/
		default:
      return state;
	}
};
