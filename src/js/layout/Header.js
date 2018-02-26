var React = require('react');


module.exports = class extends React.Component {
    render() {
        const color = Math.random() > .5 ? "green" : "red";

        return (
            <h1 style={{color: color}}>{this.props.title}</h1>
        )
    }
};