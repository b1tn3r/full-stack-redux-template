var React = require('react');


class ContestItem extends React.Component {
    handleClick() {
        this.props.onClick(this.props._id);
    }

    render() {
        return (
            <div class="contestItem link"
                 onClick={this.handleClick.bind(this)}
            >
                <div class="category-name">
                    {this.props.categoryName}
                </div>
                <div class="contest-name">
                    {this.props.contestName}
                </div>
            </div>
        );
    }
}

ContestItem.propTypes = {
    categoryName: PropTypes.string.isRequired,
    contestName: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    _id: PropTypes.string.isRequired
};

module.exports = ContestItem;