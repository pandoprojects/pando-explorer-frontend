import React from "react";
import './StakesTable.css';
import { connect } from 'react-redux'
import { BigNumber } from "bignumber.js";
import GhostButton from "../components/buttons/GhostButton";
import Wallet from "../services/Wallet";
import { canStakeFromHardwareWallet } from '../Flags';
import { showModal } from "../state/actions/Modals";
import ModalTypes from "../constants/ModalTypes";
import { store } from "../state";
import { withTranslation } from "react-i18next";
import config from "../Config";


const ten18 = (new BigNumber(10)).pow(18); // 10^18,



class StakesTableRow extends React.Component {
    constructor() {
        super();
        this.handleWithdrawStakeClick = this.handleWithdrawStakeClick.bind(this)
    }



    handleWithdrawStakeClick = () => {
        const hardware = Wallet.getWalletHardware();

        if (hardware === "ledger" && canStakeFromHardwareWallet() === false) {
            alert("Staking from hardware Ledger Wallet will be supported soon. Stay tuned!");
        }
        else {

        }
    };

    render() {
        const { stakes, isFetchingStakes, rametronStake, t } = this.props;

        let { stake, stakeLoading } = this.props;


        let { _id, type, holder, source, amount, withdrawn, return_height, purpose } = stake;
        return (



            <tr className="StakesTableRow">
                <td><a target="_blank" href={config.explorerFrontendURL + `/account/` + holder}>{holder}</a></td>
                <td>
                    {
                        type === 'vcp' &&
                        `${t(`ZYTATRON`)}`

                    }
                    {
                        type == 'gcp' &&
                        `${t(`METATRON`)}`
                    }

                    {purpose == 2 &&
                        `${t(`RAMETRON ENTERPRISE`)}`

                    }
                    {purpose == 3 &&
                        `${t(`RAMETRON PRO`)}`

                    }
                    {purpose == 4 &&
                        `${t(`RAMETRON LITE`)}`

                    }
                    {purpose == 5 &&
                        `${t(`RAMETRON MOBILE`)}`
                    }
                    {/* {type === 'vcp' ?  `${t(`ZYTATRON`)}` : type === 'gcp' ?   : `${t(`RAMETRON`)}`} */}
                </td>
                <td>{Math.floor((amount / 1000000000000000000))}</td>
                <td>{withdrawn ? `${t(`UNLOCKED`)}` : `${t(`LOCKED`)}`}</td>
            </tr>






        );
    }
}

export class StakesTable extends React.Component {
    constructor() {
        super();


    }


    handleDepositStakeClick = () => {
        const hardware = Wallet.getWalletHardware();

        if (hardware === "ledger" && canStakeFromHardwareWallet() === false) {
            alert("Staking from hardware Ledger Wallet will be supported soon. Stay tuned!");
        }
        else {
            store.dispatch(showModal({
                type: ModalTypes.DEPOSIT_STAKE,
            }));
        }
    };

    handleWithdrawStakeClick = () => {
        const hardware = Wallet.getWalletHardware();

        if (hardware === "ledger" && canStakeFromHardwareWallet() === false) {
            alert("Staking from hardware Ledger Wallet will be supported soon. Stay tuned!");
        }
        else {
            store.dispatch(showModal({
                type: ModalTypes.WITHDRAW_STAKE,
            }));
        }
    };

    componentDidMount() {

    }
    componentWillUnmount() {
    }

    createRows = (t) => {
        if (this.props.stakes.length > 0) {
            return this.props.stakes.map(function (stake, index) {
                return <StakesTableRow key={stake._id}
                    stake={stake} t={t}
                />;
            });
        }
        else {
            return <tr className="text-center"><td colSpan="4" className="text-center">{this.props.t(`NO_ZYTATRON_METATRON_STAKE_DEPOSIT_FOUND`)}</td></tr>
        }
    };

    render() {
        let { stakeLoading, t } = this.props;

        return (
            <div>
                <div className="csev">
                    {/* <h5 className=" mt-5 bg-mine text-center">{t(`ZYTATRON STAKE`)}</h5> */}
                    {stakeLoading ? <p className="text-center mt-5">{t(`PLEASE_WAIT`)}..... <i class="fa fa-spinner fa-spin fa-1x ml-2" aria-hidden="true"></i></p> :
                        <table className="StakesTable"
                            cellSpacing="0"
                            cellPadding="0">
                            <thead>
                                <tr>
                                    <th>{t(`ADDRESS`)}</th>
                                    <th>{t(`TYPE`)}</th>
                                    <th>{t(`TOKENS_STAKED`)}</th>
                                    <th>{t(`WITHDRAWAL`)}</th>

                                </tr>
                            </thead>
                            <tbody>
                                {this.createRows(t)}
                            </tbody>
                        </table>
                    }


                </div>
                <div className="StakesPage__header-buttons">
                    <GhostButton title={t(`DEPOSIT_STAKE`)}
                        // iconUrl="/img/icons/deposit stake.svg"
                        onClick={this.handleDepositStakeClick} />

                    <GhostButton title={t(`WITHDRAW_STAKE`)}
                        // iconUrl="/img/icons/deposit stake.svg"
                        style={{ marginLeft: 12 }}
                        onClick={this.handleWithdrawStakeClick} />
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

export default withTranslation()(connect(mapStateToProps)(StakesTableRow));
