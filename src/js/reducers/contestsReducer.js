const initialState = {
    contests: {},               // starts here as blank, but the server side rendering will immediately override this contests obj with either the full contests list or a specific contest depending on the GET request
    currentContestId: null,     // on contest list comp by default

    fetching: false,
    fetched: false,
    error: null,
};

const reducer = function(state = initialState, action) {
    switch(action.type) {
        case "FETCH_CONTEST_PENDING": {
            return {...state, fetching: true};
        }
        case "FETCH_CONTEST_FULFILLED": {
            const pay = action.payload;     // shorten the object path
            return {...state,
                currentContestId: pay.currentContestId,
                contests: {...state.contests,             // sets contests to what it was in previous state plus the contestId contest that was fetched in axios call
                    [pay.contest._id]: pay.contest,     // ensure fetched Contest in Store's 'contests'
                },

                fetching: false,
                fetched: true,
            }
        }
        case "FETCH_CONTEST_REJECTED": {
            return {...state,
                error: action.payload,
                fetching: false,
            }
        }

        case "FETCH_CONTEST_LIST_PENDING": {
            return {...state, fetching: true};
        }
        case "FETCH_CONTEST_LIST_FULFILLED": {
            return {...state,                                   // if you ever need to manipulate immutable collections like a list or map structure, then you should use ImmutableJS to make entire new objects from lists and maps without mutating the originals. For instance:  const immutablePerson = Immutable.fromJS({ name: 'Stan', friends: ['Kyle', 'Cartman', 'Kenny'] })   This will be very useful at some point
                currentContestId: action.payload.currentContestId,  //null
                contests: action.payload.contests,                  // all contests

                fetching: false,
                fetched: true,
            }
        }
        case "FETCH_CONTEST_LIST_REJECTED": {
            return {...state,
                error: action.payload,
                fetching: false,
            }
        }
        case "POP_STATE": {
            return {...state,
                currentContestId: action.payload,   // sets to specific contestId or 'null' to cycle through contest pages and ContestList with null/undefined
            }
        }
    }

    return state;
};

module.exports = reducer;