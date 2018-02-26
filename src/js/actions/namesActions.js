import api from '../api';


function fetchNames(nameIds) {
    return function(dispatch) {
        dispatch({type: "FETCH_NAMES_PENDING"});

        api.fetchNames(nameIds).then((names) => {
            dispatch({
                type: "FETCH_NAMES_FULFILLED",
                payload: {
                    names: names,
                }
            });
        }).catch(err => {
            dispatch({
                type: "FETCH_NAMES_REJECTED",
                payload: err
            });
        });
    };
}

function addName(newName, contestId) {
    return function(dispatch) {
        dispatch({type: "ADD_NAME_PENDING"});

        api.addName(newName, contestId).then(data => {
            dispatch({
                type: "ADD_NAME_FULFILLED",
                payload: {
                    updatedContest: data.updatedContest,
                    newName: data.newName,
                }
            });
        }).catch(err => {
            dispatch({
                type: "ADD_NAME_REJECTED",
                payload: err
            });
        });
    };
}


module.exports = {
    fetchNames,
    addName,
};