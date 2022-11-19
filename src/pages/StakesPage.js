import React from "react";
import { connect } from 'react-redux'
import './StakesPage.css';
import PageHeader from "../components/PageHeader";
import { fetchStakes } from "../state/actions/Stakes";
import { showModal } from "../state/actions/Modals";
import ModalTypes from "../constants/ModalTypes";
import { StakesTable } from "../components/StakesTable";
import MDSpinner from "react-md-spinner";
import Wallet from "../services/Wallet";
import { canStakeFromHardwareWallet } from '../Flags';
import Api from "../services/Api";
import { withTranslation } from "react-i18next";


class StakesPage extends React.Component {

    constructor() {
        super();
        this.state = {
            stackes: [],
            stakeLoading: false
        };
    }
    handleDepositStakeClick = () => {
        const hardware = Wallet.getWalletHardware();

        if (hardware === "ledger" && canStakeFromHardwareWallet() === false) {
            alert("Staking from hardware Ledger Wallet will be supported soon. Stay tuned!");
        }
        else {
            this.props.dispatch(showModal({
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
            this.props.dispatch(showModal({
                type: ModalTypes.WITHDRAW_STAKE,
            }));
        }
    };

    fetchStakes = () => {
        this.props.dispatch(fetchStakes());
    };

    startPollingStakes() {
        this.setState({ stakeLoading: true });
        Api.fetchStakes(Wallet.getWalletAddress()).then((data) => {

            Api.getStakeType(Wallet.getWalletAddress()).then((his) => {

                if (his.body && his.body.length) {
                    let tempArray = []
                    for (let i of his.body) {

                        if (i.data.purpose > 1) {

                            for (let j of data.body.sourceRecords) {

                                if (j.holder == i.data.holder.address && j.source == i.data.source.address && j.type == 'rametronenterprisep') {
                                    let newObj = Object.fromEntries(
                                        Object.entries(i.data.source.coins).map(([k, v]) => [k.toLowerCase(), v])
                                    );
                                    let tempItem = { '_id': i._id, 'myholder': i.data.holder.address + '_' + i.data.purpose, 'withdrawn': j.withdrawn, 'amount': Number(newObj.ptxwei), 'holder': i.data.holder.address, 'source': i.data.source.address, 'type': 'rametronenterprisep', purpose: i.data.purpose }
                                    tempArray.push(tempItem)
                                }
                            }
                        }

                    }

                    let finalArray = []
                
                    const result = Object.values(
                        tempArray.reduce((acc, item) => {
                            acc[item.myholder] = acc[item.myholder]
                                ? { ...item, amount: item.amount + acc[item.myholder].amount }
                                : item;
                            return acc;
                        }, {})
                    ); 


                    for (let i of data.body.sourceRecords) {
                      
                        if (i.type != 'rametronenterprisep') {
                        
                            i.amount = Number(i.amount)
                            finalArray.push(i)
                        }
                    }
                  for(let i of result)
                  {
                    finalArray.push(i)
                  }

                    setTimeout(() => {
                        this.setState({ stakeLoading: false });
                        this.setState({ stackes: finalArray })
                    })
                }
                else {
                    this.setState({ stakeLoading: false });
                    this.setState({ stackes: data.body.sourceRecords })
                }
            })
                .catch(() => {
                    this.setState({ stakeLoading: false });
                });


        }).catch(() => {
            this.setState({ stakeLoading: false });
        });

    }




    componentDidMount() {
        this.startPollingStakes();
    }


    componentWillUnmount() {
    }

    render() {
        const { stakes, isFetchingStakes, t } = this.props;

        return (
            <div className="StakesPage">
                <div className="StakesPage__detail-view wrapper-transacton">
                    <PageHeader title={t(`STAKES`)}
                        sticky={true}
                    >
                        <span title="Refresh" id="Refresh" className="btn  custom-btn" onClick={() => this.startPollingStakes()} style={{ cursor: "pointer" }}>
                            <img height="30" src="/img/Path 716.svg" className="imgrefeshinc mr-rht"></img>
                        </span>
                    </PageHeader>
                    {
                        isFetchingStakes &&
                        <MDSpinner singleColor="#ffffff" className="StakesPage__detail-view-spinner" />
                    }

                    {
                        <div className="table-responsive">
                            <StakesTable t={t} stakes={this.state.stackes} stakeLoading={this.state.stakeLoading} />
                        </div>
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

export default withTranslation()(connect(mapStateToProps)(StakesPage));
