import React from 'react';


class Contest extends React.Component {
    componentDidMount() {
        this.props.fetchNames(this.props.nameIds);
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.addName(this.refs.newNameInput.value, this.props._id);
        this.refs.newNameInput.value = '';
    }

    render() {
        return (
            <div class="container mt-5">
                <div class="card">
                    <div class="card-body">
                        <h3 class="card-title">Contest Description</h3>
                        <div class="card-text">
                            {this.props.description}
                        </div>
                    </div>
                </div>

                <div class="card mt-4">
                    <div class="card-body">
                        <h3 class="card-title">Proposed Names</h3>
                    </div>
                    <ul class="list-group list-group-flush">
                        {this.props.nameIds[0] ?
                            this.props.nameIds.map(nameId =>
                                <li key={nameId} class="list-group-item">
                                    {this.props.lookupName(nameId).name}
                                </li>)
                            : <li class="list-group-item text-muted">No Proposed Names</li>
                        }
                    </ul>
                </div>

                <div class="card border-info mt-4">
                    <div class="card-body">
                        <h3 class="card-title">Propose a New Name</h3>
                        <form onSubmit={this.handleSubmit.bind(this)}>
                            <div class="input-group">
                                <input type="text" name="newName"
                                       placeholder="New Name Here..."
                                       class="form-control border-info"
                                       ref="newNameInput"
                                />
                                <span class="input-group-append">
                                    <button type="submit" class="btn btn-info">Sumbit</button>
                                </span>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="home-link link mt-4"
                     onClick={this.props.toContestList}
                >
                    Contest List
                </div>
            </div>
        );
    }
}

Contest.propTypes = {
    _id: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    toContestList: PropTypes.func.isRequired,
    fetchNames: PropTypes.func.isRequired,
    nameIds: PropTypes.array.isRequired,
    lookupName: PropTypes.func.isRequired,
    addName: PropTypes.func.isRequired,
};

module.exports = Contest;