import React from "react";
import "./SettingsPage.css";
import apiService from "../services/Api";
import Wallet from "../services/Wallet";
import { withTranslation } from "react-i18next";

import config from "../Config";
class TransactionHistory extends React.Component {
  constructor(props) {
    super();
    this.state = { transactionData: [], transactionLoading: false };
  }
  calculagteTime = (time) => {
    let fulldate = new Date(Number(time) * 1000);
    return `${fulldate.getDate()}/${fulldate.getMonth() + 1
      }/${fulldate.getFullYear()} `;
  };

  

  calcualteAmount = (amount) => {
    return amount.toFixed(4);
  };
  render() {
    const { t } = this.props;
    return (
      <div className=" ">
        <div className="row">
          <div className="col-md-12 mt-3">
            {this.state.transactionLoading ? (
              <p className="text-center mt-5">
                {t(`PLEASE_WAIT`)}.....{" "}
                <i
                  class="fa fa-spinner fa-spin fa-1x ml-2"
                  aria-hidden="true"
                ></i>
              </p>
            ) : (
              <>
                <div>
                  <div className="bg-mine wrapper-transacton p-3 text-center ">
                    <h6 style={{ color: "white" }}>
                      {" "}
                      {t(`LATEST_TRANSACTIONS`)}{" "}
                    </h6>
                    <span
                      title="Refresh"
                      id="Refresh"
                      className="btn  custom-btn"
                      onClick={() => this.getTranscton()}
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        height="30"
                        src="/img/Path 716.svg"
                        className="imgrefeshinc mr-rht"
                      ></img>
                    </span>
                  </div>
                  <div className="transaction-table table-responsive">
                    <table className="StakesTable ">
                      <thead>
                        <tr>
                          <th>{t(`TXN_HASH`)}</th>
                          <th>{t(`BLOCK`)}</th>
                          <th className="remove-space">{t(`TX_TYPE`)}</th>
                          <th>{t(`FROM`)}</th>
                          <th>{t(`TO`)}</th>
                          <th>{t(`DATE`)}</th>
                          <th>{t(`STATUS`)}</th>
                          <th>{t(`AMOUNT`)}</th>
                          <th>{t(`FEE`)}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.transactionData.length ? (
                          this.state.transactionData.map((val, index) => (

                            <tr key={index}>
                              <td>
                                <a
                                  target="_blank"
                                  href={
                                    config.explorerFrontendURL + "/txs/" + val.hash
                                  }
                                >
                                  {val.hash.substring(0, 10)}....
                                </a>
                              </td>
                              <td>{val.block_height}</td>
                              <td className="remove-space">
                                {val?.data?.outputs[0]?.address.toUpperCase() !=
                                  Number(Wallet.getWalletAddress())
                                  ? `${t("SEND")}`
                                  : `${t(`RECEIVED`)}`}
                              </td>
                              <td>
                                <a
                                  target="_blank"
                                  href={
                                    config.explorerFrontendURL +
                                    `/account/` +
                                    val.data.inputs[0].address
                                  }
                                >
                                  {val?.data?.inputs[0]?.address.substring(
                                    0,
                                    10
                                  )}
                                  ...
                                </a>
                              </td>
                              <td>
                                <a
                                  target="_blank"
                                  href={
                                    config.explorerFrontendURL +
                                    `/account/` +
                                    val.data.outputs[0].address
                                  }
                                >
                                  {val?.data?.outputs[0]?.address.substring(
                                    0,
                                    10
                                  )}
                                  ...{" "}
                                </a>
                              </td>
                              <td>{this.calculagteTime(val?.timestamp)}</td>

                              <td>
                                {" "}
                                <img
                                  src="/img/Path 476.svg"
                                  className="fin23"
                                ></img>{" "}
                                {val?.status}
                              </td>
                              <td>
                                {this.calcualteAmount(

                                  val.data.outputs[0].coins.ptxwei /
                                  1000000000000000000
                                )}{" "}
                              </td>
                              <td>
                                {this.calcualteAmount(
                                  val.data.fee.ptxwei / 1000000000000000000
                                )}{" "}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr className="text-center">
                            <td colSpan="8" className="text-center">
                              {t(`NO_TRANSACTION_HISTORY_FOUND`)}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {this.state.transactionData.length > 5 ? (
                  <a
                    href={
                      config.explorerFrontendURL +
                      `/account/` +
                      Wallet.getWalletAddress()
                    }
                    className="sd"
                    target="_blank"
                  >
                    {t(`VIEW_ALL`)}
                  </a>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.getTranscton();
  }
  componentWillUnmount() {
    clearInterval(this.stime);
  }

  getTranscton() {
    this.setState({ transactionLoading: true });
    let address = Wallet.getWalletAddress();
    apiService
      .getTransactionHistory(address)
      .then((data) => {
        if (data.body && data.body.length > 0) {


          let uniqueSet = new Set(data.body.map(JSON.stringify));
          let uniqueArray = Array.from(uniqueSet).map(JSON.parse);
          for (let i of uniqueArray) {

           
            i.data.fee = Object.fromEntries(
              Object.entries(i.data.fee).map(([k, v]) => [k.toLowerCase(), v])
            );
           
            i.data.inputs[0].coins = Object.fromEntries(
              Object.entries(i.data.inputs[0].coins).map(([k, v]) => [k.toLowerCase(), v])
            );
           
            i.data.outputs[0].coins = Object.fromEntries(
              Object.entries(i.data.outputs[0].coins).map(([k, v]) => [k.toLowerCase(), v])
            );
          }
         

          this.setState({ transactionData: uniqueArray });
        } else {
        }
        this.setState({ transactionLoading: false });
      })
      .catch(() => {
        this.setState({ transactionLoading: false });
      });
  }
}

export default withTranslation()(TransactionHistory);
