var React = require('react');
var PropTypes = require('prop-types');
var ContestItem = require('./ContestItem');


const ContestList = ({ contests, onContestClick }) => (
    <div class="mt-5">
        { Object.keys(contests).map((contestId) =>
            <ContestItem
                {...contests[contestId]}
                key={contestId}
                onClick={onContestClick}
            />
        )}
    </div>
);


ContestList.propTypes = {
    contests: PropTypes.object,
    onContestClick: PropTypes.func.isRequired
};


module.exports = ContestList;