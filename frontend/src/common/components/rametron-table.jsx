import React, { Component } from "react";
import { browserHistory, Link } from 'react-router';
import _ from 'lodash';
import cx from 'classnames';
import LoadingPanel from '../../common/components/loading-panel';
import { withTranslation } from "react-i18next";
import { t } from "i18next";
class RametronTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
           
            transactions: [],
            account: null
        };
        this.onSocketEvent = this.onSocketEvent.bind(this);
    }
    static defaultProps = {
        includeDetails: true,
        truncate: 20,
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.transactions && nextProps.transactions.length && nextProps.transactions !== prevState.transactions) {
            return { transactions: nextProps.transactions, account: nextProps.account };
        }
        return prevState;
    }
    componentDidMount() {
     
        const { updateLive } = this.props;


    }

    onSocketEvent(data) {
        if (data.type == 'transaction_list') {
            let transactions = (data.body || []).sort((a, b) => b.number - a.number);
            this.setState({ transactions })
        }
    }

    handleRowClick = (hash) => {
        browserHistory.push(`/txs/${hash}`);
    }

    render() {
        const { rametron } = this.props;
        return (
            <div className="datatransactionTable">
            <>
                {/* <LoadingPanel /> */}

                <table style={{background:'#003139',top:'41px'}} className={cx("data txn-table2")}>
                    <thead  >
                        <tr>
                            {/* <th className="tablenew" >{t(`PEER`)}</th> */}
                            <th className="tablnew">{t(`WALLET`)}</th>
                            <th className="tablnew">{t(`STAKE`)}</th>
                            {/* <th className="tablnew">{t(`PON`)}</th> */}
                            {/* <th className="tablnew">{t(`POE`)}</th> */}
                            <th className="tablnew">{t(`NODE TYPE`)}</th>

                        </tr>
                    </thead>
                    <tbody>
                        {rametron && rametron.length &&
                            rametron.map((val, index) => (
                                <tr key={index}>
                                    <td className="add"> <Link to={`/account/${val?._id}`}>{val?._id?.substring(0, 20)}.... </Link> </td>
                                    {/* <td className="add"> {val?._id?.substring(0, 20)}.... </td> */}
                                    <td> <img src="/images/PTX LOGO.svg" width="11" alt="" />  {val?.FinalAmount} PTX </td>
                                    {/* <td>{0}%</td> */}
                                    {/* <td>{0}</td> */}
                                    {/* <td> {val?.status ?
                                        <img src="/images/Group741.svg" width="70"></img> : <img width="70" src="/images/Group742.svg"></img>

                                    } </td> */}
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                
            </>
            </div>
        );
    }
}
export default withTranslation()(RametronTable)

