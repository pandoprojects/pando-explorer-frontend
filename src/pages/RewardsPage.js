import React from "react";
import { connect } from 'react-redux'
import './RewardsPage.css';
import PageHeader from "../components/PageHeader";
import MDSpinner from "react-md-spinner";
import Wallet from "../services/Wallet";
import Api from "../services/Api";
import { withTranslation } from "react-i18next";
import config from "../Config";
import Alerts from "../services/Alerts";
class RewardsPage extends React.Component {

    constructor() {
        super();
        this.state = {
            stackes: [],
            isFetchingStakes: false
        };
        this.frontendUrl = config.explorerFrontendURL
    }


    startPollingStakes() {
        this.setState({ isFetchingStakes: true })
        Api.fetchRewards(Wallet.getWalletAddress()).then((data) => {
            // 
            let rgddc = []

            for (let i of data.body) {
                if (i.type < 1) {

                    for (let j of i.data.outputs) {
                        let newObj = Object.fromEntries(
                            Object.entries(j.coins).map(([k, v]) => [k.toLowerCase(), v])
                        );
                        if (newObj.ptxwei > 0) {
                            if ((j.address).toLowerCase() == (Wallet.getWalletAddress()).toLowerCase()) {
                                i.coins = newObj.ptxwei
                                rgddc.push(i)
                            }
                        }

                    }
                }
            }
            this.setState({ stackes: rgddc, isFetchingStakes: false })
        }).catch((err) => {
            this.setState({ isFetchingStakes: false })
            //);
        })
    }

    stopPollingStakes() {
    }

    componentDidMount() {
        this.startPollingStakes()
    }

    componentWillUnmount() {
        this.stopPollingStakes();
    }

    render() {
        const { stackes, isFetchingStakes, t } = this.props;

        return (
            <div className="StakesPage">
                <div className="StakesPage__detail-view wrapper-transacton">
                    <PageHeader title={t(`LATEST_REWARDS`)}
                        sticky={true}
                    >
                        <span title="Refresh" id="Refresh" className="btn  custom-btn" onClick={() => this.startPollingStakes()} style={{ cursor: "pointer" }}>
                            <img height="30" src="/img/Path 716.svg" className="imgrefeshinc mr-rht"></img>
                        </span>

                    </PageHeader>

                    {
                        this.state.isFetchingStakes &&
                        <MDSpinner singleColor="#ffffff" className="StakesPage__detail-view-spinner" />
                    }



                    <div className="table-responsive tbaleodhe">
                        <table className="StakesTable"
                            cellSpacing="0"
                            cellPadding="0">
                            <thead>
                                <tr>
                                    <th>{t(`TRANSACTIONS`)}</th>
                                    <th>{t(`BLOCK`)}</th>
                                    <th>{t(`STATUS`)}</th>
                                    <th>{t(`AMOUNT`)}</th>
                                </tr>
                            </thead>
                            <tbody>

                                {
                                    this.state.stackes.length > 0 ?

                                        this.state.stackes.map((val, index) =>
                                            <tr key={val._id}>
                                                <td><a target="_blank" href={this.frontendUrl + `/txs/` + val.hash}>{val.hash.substring(0, 40)}....</a></td>
                                                <td>{val.block_height}</td>
                                                <td>{val.status}</td>
                                                <td>{val.coins / 1000000000000000000}</td>
                                            </tr>
                                        ) :

                                        <tr className="text-center"><td colSpan="4" className="text-center">
                                            {!this.state.isFetchingStakes &&
                                                <span>
                                                    {t(`NO_REWARD_FOUND`)}
                                                </span>
                                            }

                                        </td></tr>



                                }
                            </tbody>
                        </table>

                    </div>
                    {
                        this.state.stackes.length > 5 ?
                            <a href={this.frontendUrl + `/account/${Wallet.getWalletAddress()}`} target="_blank" className="sd">{t(`VIEW_MORE_ON_EXPLORER`)}</a>
                            : null
                    }
                </div>
            </div>
        );
    }
}


const mapStateToProps = (state, ownProps) => {
    return {
        stakes: state.stakes.stakes,

        isFetchingStakes: state.stakes.isFetchingStakes
    };
};

export default withTranslation()(connect(mapStateToProps)(RewardsPage));
