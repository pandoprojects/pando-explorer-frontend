import React from "react";
import './TransactionStatus.css';

const classNames = require('classnames');


//  Its all about the different state of the transaction
export default class TransactionStatus extends React.PureComponent {
    render() {
        let {bound, isLocal} = this.props;
        let isInbound = (bound === "inbound");
        let text = null;

        if(isInbound){
            text = "Received";
        }
        else if(isLocal){
            text = "Sent - Processing";
        }
        else{
            text = "Sent";
        }

        let className = classNames("TransactionStatus", {
            "TransactionStatus--is-inbound": isInbound
        });

        return (
            <div className={className}>
                <div className="TransactionStatus__dot"/>
                <div className="TransactionStatus__text">
                    {text}
                </div>
            </div>
        );
    }
}