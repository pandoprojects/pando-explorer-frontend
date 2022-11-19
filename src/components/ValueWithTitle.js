import React from "react";
import './ValueWithTitle.css';


//  Its about the value title and its value
class ValueWithTitle extends React.Component {
    render() {
        return (
            <div className="ValueWithTitle">
                <div className="ValueWithTitle__title">
                    {this.props.title}
                </div>
                <div className="ValueWithTitle__value">
                    {this.props.value}
                </div>
            </div>
        );
    }
}

export default ValueWithTitle;
