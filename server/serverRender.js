const React = require('react');
const ReactDOMServer = require('react-dom/server');
const axios = require('axios');
const { Provider } = require('react-redux');              // wrap <App> in a <Provider> with the 'store' as an attr so that the Store is made available to all components in our component tree

var config = require('./config');
var App = require('../src/js/App');
const { generateStore } = require('../src/js/store');       // import created store with combined reducers that has the store split into 'contests' data and 'names' data


const getApiUrl = contestId => {                    // gets needed url (for axios) depending on if user requested home page '/' or a individual 'contest' page
    let apiUrl = `${config.serverUrl}/api/contests`;
    if(contestId) {
        apiUrl = `${apiUrl}/${contestId}`;
    }
    return apiUrl;
};
const getInitialData = (contestId, resData) => {
    if(contestId) {
        return {
            contests: {
                currentContestId: contestId,
                contests: {[resData._id]: {...resData}},
            },
            names: {}
        }
    }
    return {
        contests: resData,
        names: {}
    };
};


module.exports = function serverRender(contestId) {
    return axios.get(getApiUrl(contestId))
        .then((res) => {
            const initialData = getInitialData(contestId, res.data);

            const store = generateStore(initialData);       // the default initialState values in the reducers (between both namesReducer and contestsReducer) have their values overridden or new ones added if not existent and they are saved to the initial store state once created, which we can then use to initialize our App with by placing the generated Store in the Provider wrapper and then the initialData will be passed into the App with the connect() decorator on the App to initialize App's state with the initialData properties (contests and currentContestId depending on the GET request)
            const preloadedState = store.getState();        // takes the already generated Store's data including its default data and the initialData from the axios call, and it passes the preloadedState into the 'initialData' template variable that will be passed to the client to create the exact same state (from this preloadedState snapshot) so the same state is used in the Provider wrapper for the server and client side

            return {
                initialMarkup: ReactDOMServer.renderToString(
                    <Provider store={store}>
                        <App />
                    </Provider>
                ),
                initialData: preloadedState         // sends the preloadedState copy of initial generated Store to the client where the client will call generateState(preloadedState) to create the exact same state to use in the Provider wrapper on the client side, which it then hydrates this Store wrapped <App> and activates all its js functions, which is the most efficient way to do the server side rendering
            }
        })
        .catch(console.error);
};