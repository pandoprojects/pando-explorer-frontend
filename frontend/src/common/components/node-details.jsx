import React, { Component } from "react";
import moment from "moment";

export default class NodeDetailsComponent extends Component {
    constructor(props) {
        super()
        this.Back = this.Back.bind(this)

    }
    Back() {
        this.props.back();
    }

    render() {
        const { t, nodeDetails, ip } = this.props;
        return (
            <div className="content transaction-details">
                <> <div className="page-title transactions" style={{ width: '96%', letterSpacing: 'normal' }}>{ip} </div>
                    <button className="btn btn-success custom-btn" onClick={this.Back} style={{ bottom: "57px" }} title={t(`REFRESH`)} ><img height={15} src="/images/rIcon ionic-md-refresh-circle.svg" alt="" /></button>
                    {
                        nodeDetails &&
                        <table className="details account-info">
                            <thead>
                                <tr>
                                    <th>{t(`ADDRESS`)}</th>
                                    <th>{nodeDetails?.address}
                                    </th>
                                </tr>

                                <tr>
                                    <th>{t(`LATEST_FINALIZED_BLOCK_HEIGHT`)}</th>
                                    <th>{nodeDetails?.latest_finalized_block_height}</th>
                                </tr>
                                <tr>
                                    <th>{t(`CURRENT_HEIGHT`)}</th>
                                    <th>{nodeDetails?.current_height}</th>
                                </tr>
                                <tr>
                                    <th>{t(`CURRENT_TIME`)}</th>
                                    <th>{moment.unix(nodeDetails?.current_time).format('hh:mm:ss')}</th>
                                </tr>
                                <tr>
                                    <th>{t(`SYNCING`)}</th>
                                    <th>{nodeDetails?.syncing ? t(`TRUE`) : t(`FALSE`)} <small>({nodeDetails?.syncing ? t(`YOUR_NODE_IS_IN_SYNCING_MODE`) : t(`ALREADY_SYNCED_WITH_THE_CURRENT_HEIGHT`)} )</small> </th>
                                </tr>
                            </thead>
                            <tbody>

                            </tbody>
                        </table>
                    }
                </>
            </div>
        )
    }
}

