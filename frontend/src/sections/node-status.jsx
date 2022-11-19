import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import LoadingPanel from "../common/components/loading-panel";
import { stakeService } from "../common/services/stake";
import { rtservices } from "../common/services/rtservices";
import NodeDetailsComponent from "../common/components/node-details";
import Pagination from "../common/components/pagination";
class NodeStatus extends Component {
  constructor(props) {
    super(props);
    this.searchInput = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.back = this.back.bind(this);
    this.state = {
      loading: false,
      nodeDetails: null,
      showDetails: false,
      ip: null,
      required: false,
      errorMsg: false,
      publicnnode: [],
      currentPage: 1,
      totalPages: 1,
      loading_txns: true
     
    };
  }
  componentDidMount() {
  this.tst()
    this.setState({ showDetails: false });
  }
  tst()
  {  this.setState({
    loading_txns: true
   })

    rtservices.getPublicNodes().then((data) => {
      this.setState({publicnnode:data.data.data,
        totalPages:data.data.data.pageCount,
        currentPage:data.data.data.page,
        loading_txns: false
       })
    })
    .catch((err) => {
      
    });
  }
  handleEnterKey(e) {
    if (e.key === "Enter") {
      this.handleSubmit();
    }
  }
  handleSubmit() {
    if (this.searchInput.value) {
      let ipAddress = this.searchInput.value;
      this.setState({ loading: true, required: false, errorMsg: false });
      stakeService
        .getNodeStake(ipAddress)
        .then((data) => {
          this.setState({
            loading: false,
            nodeDetails: data.result,
            showDetails: true,
            ip: ipAddress,
          });
        })
        .catch((err) => {
          this.setState({ loading: false, errorMsg: true });
        });
    } else {
      this.setState({ required: true });
    }
  }
  handlePageChange(){

  }
  back() {
    this.setState({ showDetails: false });
  }

  render() {
    const { t } = this.props;
    const { publicnnode,  currentPage,totalPages,loading_txns } = this.state;

    return (
      <>
        {this.state.loading ? (
          <LoadingPanel />
        ) : this.state.showDetails ? (
          <NodeDetailsComponent
            back={this.back}
            t={t}
            nodeDetails={this.state?.nodeDetails}
            ip={this.state.ip}
          ></NodeDetailsComponent>
        ) : (
          <div className="content node-status">
            <div className=" public-node">
              <div className="title pub2"><p><img src="../images/Group 4235.png" />{t(`PUBLIC NODE SUMMARY`)}
              
              </p></div>
              <div className="">

                <div className="blk9">
                  <div className="no-po">
                    <h3>{t(`PUBLIC NODE POOL`)}
                    <button className="btn custom-btn hom-ref" title="Refresh" onClick={() => this.tst()} ><img src="/images/Layer 2.svg" alt="" /></button>
                    </h3>
                  </div>
                  <div className="table-responsive">
                  {loading_txns ?
                    <LoadingPanel />
                    :
                    <table className="data block-table">
                      <thead>
                        <tr>
                          <th className="remnode"><p>{t(`WALLET`)}</p></th>
                          <th className="members"><p>{t(`TOTAL_STAKED`)}</p></th>
                          <th className="uptime"><p>{t(`NODE_TYPE`)}</p></th>
                          <th className="uptime"><p>{t(`STATUS`)}</p></th>
                          <th className="uptime"><p>{t(`OWNER`)}</p></th>
                        </tr>
                      </thead>
                      <tbody>
                      {_.map(publicnnode.data, (txn, index) => {
                         return (
                        <tr>
                          <td className="remnode overflow">{txn.walletaddress} <img src="../images/copy@2x.svg"  data-toggle="tooltip" data-placement="top" title="Copy Node Summary" className="copyw" onClick={() => {navigator.clipboard.writeText(txn.nodesummery)}} /> </td>
                          <td className="members">{txn.totalstake}</td>
                          <td className="members">{txn.type}</td>
                          <td className="uptime">
                            {
                              txn.active &&
                              'Active'
                            }
                            {
                              !txn.active &&
                              'Not Active'
                            }
                          </td>
                          <td className="uptime">{txn.owner}</td>
                        </tr>
                         );
                      }
                    )}
                        
                      </tbody>
                    </table>
                    }
                  </div>
                  <Pagination
                    size={'lg'}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={this.handlePageChange}
                    disabled={loading_txns} />
                </div>
              </div>
            </div>



{/* 
            <div className="chk-rem mb-4 mt-5">
              <h2>{t(`CHECK_METATRAON_ZYTATRON_STATUS`)}</h2>
            </div> */}


            {/* <div className="nod-st">
              <div className="row">
                <div className="col-md-6 ip09">
                  <p>{t(`PLEASE_INSERT_NODE_IP_ADDRESS`)}</p>
                  <input
                    type="text"
                    className="ip-input"
                    ref={(input) => (this.searchInput = input)}
                    onKeyPress={(e) => this.handleEnterKey(e)}
                  />
                  <br />
                  {this.state.required ? (
                    <small className="text-danger">{t(`REQUIRED`)}</small>
                  ) : null}

                  {this.state.errorMsg ? (
                    <small className="text-danger">
                      {t(`PLEASE_ENTER_VALID_NODE_IP_ADDRESS`)}
                    </small>
                  ) : null}
                  <p className="nodeStatusDisclaimer">{t(`DISCLAIMERS`)}</p>
                  <div className="ip-btn-left">
                    <button
                      className="btn custom-ip-btn"
                      onClick={this.handleSubmit}
                    >
                      {t("SUBMIT")}
                    </button>
                  </div>
                </div>

                <div className="rametron-section col-md-6" >
                  <img src="images/IMG 2.png" alt="" />
                </div>
              </div>
            </div> */}

          </div>
        )}
      </>
    );
  }
}

export default withTranslation()(NodeStatus);
