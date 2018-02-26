const { combineReducers } = require('redux');

const contests = require('./contestsReducer');
const names = require('./namesReducer');

const reducers = combineReducers({
    contests,
    names
});

module.exports = { reducers };