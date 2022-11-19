import React from "react";
import './PandoTransactionListItem.css';
import moment from 'moment';
import TransactionStatus from './TransactionStatus'
import {numberWithCommas, truncate} from "../utils/Utils";
import _ from 'lodash';
import Pando from '../services/Pando';


// 
class PandoTransactionListItem extends React.Component {
    render() {
        let { transaction } = this.props;
        let {inputs, outputs, timestamp, bound, hash, is_local} = transaction;
        let input = (inputs ? inputs[0] : null);
        let output = (outputs ? outputs[0] : null);
        let from = _.get(input, ['address']);
        let to = _.get(output, ['address']);
        let isReceived = (bound === "inbound");
        let explorerUrl = Pando.getTransactionExplorerUrl(transaction);

        //Truncate the addresses to help reduce the run ons
        from = truncate(from, 23, '...');
        to = truncate(to, 23, '...');

        let pandoAmount = _.get(output, ['coins', 'pando']);
        let ptxAmount = _.get(output, ['coins', 'ptx']);

        return (
            <a className="PandoTransactionListItem"
               href={explorerUrl}
               target="_blank"
            >
                <div className="PandoTransactionListItem__left-container">
                    <div className="PandoTransactionListItem__top-container">
                        <TransactionStatus bound={bound} isLocal={is_local}/>
                    </div>
                    <div className="PandoTransactionListItem__middle-container">
                        <div className="PandoTransactionListItem__address-container">
                            <div className="PandoTransactionListItem__address-prefix" >{isReceived ? "FROM:" : "TO:"}</div>
                            <div className="PandoTransactionListItem__address">{isReceived ? from : to}</div>
                        </div>
                    </div>
                    <div className="PandoTransactionListItem__bottom-container">
                        <div className="PandoTransactionListItem__date">{moment.unix(timestamp).fromNow()}</div>
                    </div>
                </div>

                <div className="PandoTransactionListItem__right-container">
                    <div className="PandoTransactionListItem__amount-container">
                        <div className="PandoTransactionListItem__amount">{numberWithCommas(pandoAmount)}</div>
                        <img className="PandoTransactionListItem__amount-icon"
                             src="/img/tokens/Pando_large@2x.png"
                        />
                    </div>
                    <div className="PandoTransactionListItem__amount-container">
                        <div className="PandoTransactionListItem__amount">{numberWithCommas(ptxAmount)}</div>
                        <img className="PandoTransactionListItem__amount-icon"
                             src="/img/tokens/ptx_large@2x.png"
                        />
                    </div>
                </div>
            </a>
        );
    }
}

export default PandoTransactionListItem;
