import { applyMiddleware, createStore } from 'redux';
// Middleware Plugins
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';

const { reducers } = require('./reducers');     // combinedReducers imported


const middleware = applyMiddleware(promise(), thunk, createLogger());       // middleware created with plugins

function generateStore(preloadedState) {
    if(preloadedState) {
        return createStore(reducers, preloadedState, middleware);       // if a preloaded state is passed into generateStore() then the preloadedState is passed in as the 2nd arg, which is where this would go to optionally specify the state to hydrate it for the client rendering and using it from the previous server side rendering initial state that was retrieved with store.getState() and then the preloadedState is passed to the client where the store can now be generated with the existing preloadedState to hydrate the client's js enabled App on top of the static App elements that were initially rendered with renderToString().. This preloadedState can also be passed in in other circumstances to restore a previously serialized user session such as a saved game or saved snapshot of your App that you want restored exactly how the user left it.
    }
    return createStore(reducers, middleware);
}

module.exports = { generateStore };