import React from 'react';
import { connect } from 'react-redux';

var Header = require('./layout/Header');
var ContestList = require('./components/ContestList');
var Contest = require('./components/Contest');

var { fetchContest, fetchContestList, popState } = require('./actions/contestsActions');
var { fetchNames, addName } = require('./actions/namesActions');


// Simple History API routing Without React-router
const pushState = (stateObj, url) => {
    window.history.pushState(stateObj, '', url);
};


const onPopState = (handler) => {
    window.onpopstate = handler;
};


@connect((store) => {       // store passes in this.props.dispatch and all the properties below into App, and this is App's new central mainframe like it's State when not using Redux.
    return {
        contests: store.contests.contests,
        currentContestId: store.contests.currentContestId,
        names: store.names.names,
    }
})
class App extends React.Component {

    //state = this.props.initialData;    // state is not usually used with redux, since most of our state like properties are coming from the @connect decorator that we reference from props like 'this.props.contests' and this allows us to re-render the app by re-rendering the store when we dispatch actions, whereas before we used setState() and updated the state object to re-render, however now, we are sending actions to the reducers to update the store and this will trigger a re-render every time and only update parts of the DOM that the changed store data visually changes in the Virtual DOM, and thus it has the same effect, but everything goes through the Store now instead of the state. However we can still use state in rare instances when lower level Components need to adjust something local or purely visual like toggling a UI element or keeping track of a selectable list's selected item, etc.


    componentDidMount() {
        onPopState((event) => {
            this.props.dispatch(popState(event.state));     // adds dispatch popState action as the onpopstate event handler for whenever the user navigates Back/Forward, the action will dispatch
        });
    }

    componentWillUnmount() {
        onPopState(null);
    }

    fetchContest(contestId) {
        pushState(
            {currentContestId: contestId},
            `/contest/${contestId}`
        );

        this.props.dispatch(fetchContest(contestId));
    }

    // Gets the object of the currentContestId
    currentContest() {
        return this.props.contests[this.props.currentContestId];
    }
    // Gets value for the Page Title
    pageTitle() {
        if(this.props.currentContestId) {
            return this.currentContest().contestName;
        }
        return "Naming Contests";
    }

    fetchContestList() {
        pushState(
            {currentContestId: null},
            '/'
        );

        this.props.dispatch(fetchContestList());
    }

    fetchNames(nameIds) {
        if(nameIds.length === 0) {      // return if no nameIds for contest record
            return;
        }
        this.props.dispatch(fetchNames(nameIds));
    }

    lookupName(nameId) {
        if(!this.props.names || !this.props.names[nameId]) {
            return {name: "..."};
        }
        return this.props.names[nameId];
    }

    addName(newName, contestId) {
        this.props.dispatch(addName(newName, contestId));
    }


    currentContent() {

        if(this.props.currentContestId) {
            return (
                <Contest
                    {...this.currentContest()}
                    toContestList={this.fetchContestList.bind(this)}
                    fetchNames={this.fetchNames.bind(this)}
                    lookupName={this.lookupName.bind(this)}
                    addName={this.addName.bind(this)}
                />
            );
        }

        return (
            <ContestList
                contests={this.props.contests}
                onContestClick={this.fetchContest.bind(this)}
            />
        );
    }


    render() {
        return (
            <div class="container">
                <Header title={this.pageTitle()} />

                {this.currentContent()}
            </div>
        );
    }
}

module.exports = App;

