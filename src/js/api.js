import axios from 'axios';


const fetchContest = contestId => {
    return axios.get(`/api/contests/${contestId}`)
        .then(response => response.data);
};

const fetchContestList = () => {
    return axios.get('/api/contests')
        .then(res => res.data.contests);
};

const fetchNames = nameIds => {
    return axios.get(`/api/names/${nameIds.join(',')}`)
        .then(response => response.data.names);
};

const addName = (newName, contestId) => {
    return axios.post('/api/names', { newName, contestId })
        .then(response => response.data);
};

module.exports = {
    fetchContest,
    fetchContestList,
    fetchNames,
    addName
};