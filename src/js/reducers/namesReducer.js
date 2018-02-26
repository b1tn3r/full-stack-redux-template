const initialState = {
    contests: {},           // this can be set here, but it will not be the same as 'contests' in the contestsReducer since that will be referenced from App like 'store.contests.contests' whereas this one is referenced as 'store.names.contests', we can come up with a function to join them, or we might want to turn the namesReducer and contestsReducer into just one reducer since they are pertaining to the same database (combineReducers should be used for completely separate data) so in the future, use the same reducer for collections that interact with one another (we will not change this because fuck it).. This would fix the problem of addName not instantly adding the name to the list of names in Contest and having to refresh to see the newName
    names: {},

    fetching: false,
    fetched: false,
    error: null,
};

const reducer = function(state = initialState, action) {
    switch(action.type) {
        case "FETCH_NAMES_PENDING": {
            return {...state, fetching: true};
        }
        case "FETCH_NAMES_FULFILLED": {     // try to always write as much of your code as possible in the action-creators (actions) and keep the reducers as dumb as possible (enough to set the data and that's it), this way we can ensure we have more control over the actions and business logic that occurs in them especially in the asynchronous actions that run several dispatches using thunk by then both controlling the results of the data changes and also the metadata like fetch, fetching, loading, etc.
            return {...state,
                names: action.payload.names,

                fetching: false,
                fetched: true,
            }
        }
        case "FETCH_NAMES_REJECTED": {
            return {...state,
                error: action.payload,
                fetching: false,
            }
        }

        case "ADD_NAME_PENDING": {
            return {...state, fetching: true};
        }
        case "ADD_NAME_FULFILLED": {
            const pay = action.payload;     // shorten the object path
            return {...state,
                contests: {                 // previous 'contests' plus the updatedContest updated on Mongo
                    ...state.contests,
                    [pay.updatedContest._id]: pay.updatedContest,
                },
                names: {                    // previous 'names' plus the new name created on Mongo
                    ...state.names,
                    [pay.newName._id]: pay.newName,
                },

                fetching: false,
                fetched: true,
            }
        }
        case "ADD_NAME_REJECTED": {
            return {...state,
                error: action.payload,
                fetching: false,
            }
        }
    }

    return state;
};

module.exports = reducer;