import React, { Component } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import TabBar from "./components/TabBar";
import TabBarItem from "./components/TabBarItem";
import { Pages, WalletPages } from "./Pages";
import Modals from "./components/Modals";
import { showModal } from "./state/actions/Modals";
import ModalTypes from "./constants/ModalTypes";
import { store } from "./state";
import Router from "./services/Router";
import Wallet from "./services/Wallet";
import { isStakingAvailable, areSmartContractsAvailable } from "./Flags";
import Alerts from "./services/Alerts";
import { copyToClipboard } from "./utils/Utils";
import { logout } from "./state/actions/Wallet";
import apiService from "./services/Api";
import { withTranslation } from "react-i18next";

let balance = 0;

class WalletTabBar extends Component {
  constructor() {
    super();

    this.logout = this.logout.bind(this);
  }
  componentDidMount() { }

  logout() {
    window.localStorage.clear();
    console.clear();
    store.dispatch(logout());
  }

  render() {
    const { t } = this.props;
    return (
      <TabBar className="TabBar1 ">
        <TabBarItem
          isMobile={this.props.isMobile}
          title={t(`WALLET`)}
          href="/wallet/tokens"
          normalIconUrl="/img/tab-bar/wallet@2x.svg"
          activeIconUrl="/img/tab-bar/Icon material-call_received.svg"

        />

        {isStakingAvailable() && (
          <TabBarItem
            isMobile={this.props.isMobile}
            title={t(`REWARDS`)}
            href="/wallet/rewards"
            normalIconUrl="/img/tab-bar/Icon material-stars.svg"
            activeIconUrl="/img/tab-bar/Icon material-call_received.svg"
          />
        )}
        {isStakingAvailable() && (
          <TabBarItem
            isMobile={this.props.isMobile}
            title={t(`STAKES`)}
            href="/wallet/stakes"
            normalIconUrl="/img/tab-bar/Icon awesome-coins.svg"
          />
        )}
        {areSmartContractsAvailable() && (
          <TabBarItem
            isMobile={this.props.isMobile}
            title={t(`CONTRACT`)}
            href="/wallet/contract"
            normalIconUrl="/img/tab-bar/Icon awesome-file-contract.svg"
            activeIconUrl="/img/tab-bar/Icon material-call_received.svg"
          />
        )}

        <TabBarItem
          isMobile={this.props.isMobile}
          title={t(`SETTINGS`)}
          href="/wallet/settings"
          normalIconUrl="/img/tab-bar/Icon ionic-ios-settings.svg"
          activeIconUrl="/img/tab-bar/Icon material-call_received.svg"
        />
        <TabBarItem
          isMobile={this.props.isMobile}
          title={t(`LOG_OUT`)}
          onClick={this.logout}
          normalIconUrl="/img/tab-bar/LOGOUT.svg"
          activeIconUrl="/img/tab-bar/Icon material-call_received.svg"
        />
      </TabBar>
      // </TabBar>

    );
  }





  render() {



    const { t } = this.props

    return (

      <TabBar className="TabBar1 " >
        {/* <img className="NavBar__logo" src={'/img/logo/pando_wallet_logo@2x.svg'} /> */}
        <TabBarItem
          isMobile={this.props.isMobile}
          title={t(`WALLET`)}
          href="/wallet/tokens"
          normalIconUrl="/img/tab-bar/wallet@2x.svg"
          activeIconUrl="/img/tab-bar/WALLET2.svg"


        />

        {isStakingAvailable() &&
          <TabBarItem
            isMobile={this.props.isMobile}
            title={t(`REWARDS`)}
            href="/wallet/rewards"
            normalIconUrl="/img/tab-bar/REWARD.svg"
            activeIconUrl="/img/tab-bar/REWARD2.svg"
          />
        }
        {
          isStakingAvailable() &&
          <TabBarItem
            isMobile={this.props.isMobile}
            title={t(`STAKES`)}
            href="/wallet/stakes"
            normalIconUrl="/img/tab-bar/STAKE.svg"
            activeIconUrl="/img/tab-bar/STAKE2.svg"
          />
        }
        {
          areSmartContractsAvailable() &&
          <TabBarItem
            isMobile={this.props.isMobile}
            title={t(`CONTRACT`)}
            href="/wallet/contract"
            normalIconUrl="/img/tab-bar/CONTRACT.svg"
            activeIconUrl="/img/tab-bar/Group 812.svg"
          />
        }

        <TabBarItem
          isMobile={this.props.isMobile}
          title={t(`SETTINGS`)}
          href="/wallet/settings"
          normalIconUrl="/img/tab-bar/SETTING.svg"
          activeIconUrl="/img/tab-bar/SETTING2.svg"
        />
        <TabBarItem
          isMobile={this.props.isMobile}
          title={t(`LOG_OUT`)}
          onClick={this.logout}
          normalIconUrl="/img/tab-bar/LOGOUT.svg"

        />
      </TabBar>


    );
  }
}

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balance: 0,
    };
  }
  liftState = (state) => {
    this.setState(balance);
  };
  componentDidMount() {
    Router.setHistory(this.props.history);
  }
  componentWillUnmount() { }

  render() {
    let address = Wallet.getWalletAddress();

    return (
      <div className="App">
        <NavBar centered={address === null} />
        <Pages />
        <Modals />
      </div>
    );
  }
}

class WalletApp extends Component {
  constructor() {
    super();
    this.onSendClick = this.onSendClick.bind(this);
    this.onReceiveClick = this.onReceiveClick.bind(this);
    this.state = {
      balance: 0,
      stakeDetails: { totalStakeAmount: 0, totalStake: 0 },
      transactionData: "",
      address: null,
      rametronStake: [],
      tokenLoading: false,
      stakeLoading: false,
      width: window.innerWidth,
      stackes: []
    };
    this.interval = null;
  }
  onSendClick() {
    store.dispatch(
      showModal({
        type: ModalTypes.SEND,
      })
    );
  }

  onReceiveClick() {
    store.dispatch(
      showModal({
        type: ModalTypes.RECEIVE,
      })
    );
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleWindowSizeChange);
    Router.setHistory(this.props.history);
    this.setState({ address: Wallet.getWalletAddress() });
    this.loadData();
  }

  loadData() {
   
  
    this.getBalance();
    this.getStakeData();
    this.getTransaction();
  
  
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowSizeChange);
    clearInterval(this.interval);
  }

  handleWindowSizeChange = () => {
    this.setState({ width: window.innerWidth });
  };

  getTransaction() {
    let address = Wallet.getWalletAddress();
    apiService
      .getTransactionHistory(address)
      .then((data) => {
        if (data.body && data.body.length > 0) {
          this.setState({ transactionData: data.body });
        } else {
          this.setState({ transactionData: [] });
        }
         console.clear();
      })
      .catch(() => {
        this.setState({ tokenLoading: false });
      });
  }

  getBalance() {
    this.setState({ tokenLoading: true });
    let address = Wallet.getWalletAddress();
    apiService
      .getWalletBalance(address)
      .then((res) => {
        this.setState({ tokenLoading: false });
       
        if (res.body && res.body.balance) {
          res.body.balance.Test = '1'
          const newObj = Object.fromEntries(
            Object.entries(res.body.balance).map(([k, v]) => [k.toLowerCase(), v])
          );
          this.setState({
            balance: Number(newObj.ptxwei / 1000000000000000000),
          });
        } else {
          this.setState({ balance: 0 });
        }
      })
      .catch(() => {
        this.setState({ tokenLoading: false });
      });
  }

  getStakeData() {
    this.setState({ stakeLoading: true });
    apiService
      .fetchStakes(Wallet.getWalletAddress())
      .then((data) => {
        this.setState({ stackes: data.body.sourceRecords });
        let totalStake = 0;
        // let stakrle = 0
        for (let i of data.body.sourceRecords) {
          totalStake = totalStake + i.amount / 1000000000000000000;
          // stakrle++
        }
        apiService
          .getStakeType(Wallet.getWalletAddress())
          .then((his) => {
            // if (his.body && his.body.length) {
            // }
            this.setState({
              stakeDetails: {
                totalStakeAmount: totalStake.toFixed(4),
                totalStake: his.body.length
              },
              stakeLoading: false,
            });
            this.setState({ stakeLoading: false });
          })
          .catch(() => {
            this.setState({ stakeLoading: false });
          });
      })
      .catch(() => {
        this.setState({ stakeLoading: false });
      });
  }
  copyAddress = () => {
    copyToClipboard(Wallet.getWalletAddress());
    Alerts.showSuccess(this.props.t(`YOUR_ADDRESS_HAS_BEEN_COPIED`));
  };

  render() {
    const { width } = this.state;
    const isMobile = width <= 776;
    const { t } = this.props;
    return (
      <div className="App WalletApp">
        <NavBar />
        <div className="container-flud dashboard">
          <div className="row ">
            {/*Desktop Section starts Here*/}
            {!isMobile && (
              <div className="col-md-2 side-nav for-wi3 ">
                <WalletTabBar t={t} />
              </div>
            )}
            {/*Desktop Section Ends here*/}
            {/*Mobile Section Starts here*/}
            {isMobile && (
              <nav className="navbar navbar-expand-lg navbar-light">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdownMenuLink"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <span className="navbar-toggler-icon"></span>
                </a>
                <div
                  class="dropdown-menu"
                  aria-labelledby="navbarDropdownMenuLink"
                >
                  <WalletTabBar t={t} isMobile={isMobile} />
                </div>
              </nav>
            )}
            {/*Mobile Section Ends here */}

            <div className="col-md-10 fkju7">


              <div className="main-wrapper">
                <div className="right-side-details wallet-id">
                  <p className="p-1">
                    {t(`MY_WALLET_ID`)} :
                    <span style={{ color: "white" }} className="ml-2">
                      {this.state.address}
                      <a
                        className="NavBar__wallet-copy-address-icon"
                        onClick={this.copyAddress}
                      >
                        <img src="/img/icons/copy@2x.svg" />
                      </a>
                    </span>
                  </p>
                </div>
                <div className="right-side-details">
                  <p className="p-1">
                    {" "}
                    {t(`TOKENS_AVAILABLE`)} :
                    {this.state.tokenLoading ? (
                      <>
                        <span>
                          <i
                            className="fa fa-spinner fa-spin fa-1x mr-2"
                            aria-hidden="true"
                          ></i>{" "}
                          Please wait ...
                        </span>
                      </>
                    ) : (
                      <span
                        style={{
                          float: "none",
                          color: "white",
                          marginLeft: "4px",
                        }}
                      >
                        {this.state.balance.toFixed(4)} PTX
                      </span>
                    )}
                    <span
                      title="Refresh"
                      id="Refresh"
                      className="btn  custom-btn"
                      onClick={() => this.loadData()}
                      style={{ cursor: "pointer" }}
                    ></span>
                    <span
                      className="refreshbutton"
                      title="Refresh"
                      id="Refresh"
                    >
                      <img
                        src="/img/Path 716.svg"
                        onClick={() => this.loadData()}
                        style={{ cursor: "pointer" }}
                        className="imgrefeshinc"
                      ></img>
                    </span>
                  </p>
                </div>

                <div className="parentcontainer">
                  <WalletPages key={this.state.balance} t={t} />

                  <div className="smallcontainer snd-rec">
                    <div className="tab-wrapper-send-recieve">
                      <TabBarItem
                        title={t(`SEND`)}
                        onClick={this.onSendClick}
                        normalIconUrl="/img/tab-bar/send@2x.svg"
                        activeIconUrl="/img/tab-bar/Icon ionic-ios-send.svg"
                      />

                      <TabBarItem
                        title={t(`RECEIVE`)}
                        onClick={this.onReceiveClick}
                        normalIconUrl="/img/tab-bar/receive@2x - grey.svg"
                        activeIconUrl="/img/tab-bar/Icon material-call_received.svg"
                      />
                    </div>

                    <div className="sidecontainer">
                      <ul className="detail ">
                        <li>
                          <div className="detail1">
                            <div className="pt-4 effectClass">
                              <img
                                src="/latest/TRANSACTION.svg"
                                height="30"
                              />
                              <p>{t(`TOTAL_TRANSACTION`)} </p>
                              <span className="innerValue">
                                {this.state?.transactionData
                                  ? this.state?.transactionData?.length
                                  : 0}
                              </span>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="detail2 effectClass">
                            <div className="pt-4">
                              <img
                                src="/latest/NO OF STAKE.svg"
                                height="30"
                              />
                              <p>{t(`NO_OF_STAKE`)}</p>
                              <span className="innerValue">
                                {this.state.stakeLoading ? (
                                  <i
                                    className="fa fa-spinner fa-spin fa-1x ml-2"
                                    aria-hidden="true"
                                  ></i>
                                ) : (
                                  this.state.stakeDetails.totalStake
                                )}
                              </span>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="detail3 effectClass">
                            <div className="pt-4">
                              <img
                                src="/latest/TOTAL OF STAKE.svg"
                                height="30"
                              />
                              <p>{t(`TOTAL_STAKE_AMOUNT`)}</p>
                              <span className="innerValue">
                                {this.state.stakeLoading ? (
                                  <i
                                    className="fa fa-spinner fa-spin fa-1x ml-2"
                                    aria-hidden="true"
                                  ></i>
                                ) : (
                                  <>
                                    {this.state.stakeDetails.totalStakeAmount}{" "}
                                    PTX
                                  </>
                                )}
                              </span>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Modals />
          {/* <UnsupportedDevice /> */}
        </div>
      </div>
    );
  }
}

export default withTranslation()(WalletApp);
