import api from '../api';


function fetchContest(contestId) {
    return function(dispatch) {
        dispatch({type: "FETCH_CONTEST_PENDING"});

        api.fetchContest(contestId).then(contest => {
            dispatch({
                type: "FETCH_CONTEST_FULFILLED",
                payload: {
                    currentContestId: contest._id,
                    contest: contest,
                }
            });
        }).catch(err => {
            dispatch({
                type: "FETCH_CONTEST_REJECTED",
                payload: err
            });
        });
    };
}


function fetchContestList() {
    return function(dispatch) {
        dispatch({type: "FETCH_CONTEST_LIST_PENDING"});

        api.fetchContestList().then(contests => {
            dispatch({
                type: "FETCH_CONTEST_LIST_FULFILLED",
                payload: {
                    currentContestId: null,
                    contests: contests,
                }
            });
        }).catch(err => {
            dispatch({
                type: "FETCH_CONTEST_LIST_REJECTED",
                payload: err
            });
        });
    };
}

function popState(toState) {        // passes in state in our history that we had pushed at some point with pushState()
    return {
        type: "POP_STATE",
        payload: (toState || {}).currentContestId,  // will be specific contestId or undefined (undefined sends user back to ContestList comp)
    }
}

module.exports = {
    fetchContest,
    fetchContestList,
    popState,
};