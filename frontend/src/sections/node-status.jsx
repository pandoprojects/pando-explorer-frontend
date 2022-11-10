import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import LoadingPanel from "../common/components/loading-panel";
import { stakeService } from "../common/services/stake";
import NodeDetailsComponent from "../common/components/node-details";

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
    };
  }
  componentDidMount() {
    this.setState({ showDetails: false });
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
  back() {
    this.setState({ showDetails: false });
  }

  render() {
    const { t } = this.props;
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
             <div className="content public-node">
                                    <div class="title pub2"><p><img src="../images/Group 4235.png" />PUBLIC NODE SUMMARY</p></div>
                                    <div className="">

                                        <div class="blk9">
                                            <div className="no-po">
                                                <h3>Public Node Pool</h3>
                                            </div>
                                            <div className="table-responsive">
                                                <table class="data block-table">
                                                    <thead>
                                                        <tr>
                                                            <th class="remnode"><p>RAMETRON NODE</p></th>
                                                            <th class="members"><p>NO. OF MEMBERS</p></th>
                                                            <th class="uptime"><p>UP TIME PERCENTAGE</p></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td class="remnode overflow">0x23473e46b0c2cc51d93d0e77ef6e7051918... <img src="../images/copy@2x.svg" /></td>
                                                            <td class="members">40</td>
                                                            <td class="uptime">45%</td>
                                                        </tr>
                                                        <tr>
                                                            <td class="remnode overflow">0x23473e46b0c2cc51d93d0e77ef6e7051918... <img src="../images/copy@2x.svg" /></td>
                                                            <td class="members">41</td>
                                                            <td class="uptime">46%</td>
                                                        </tr>
                                                        <tr>
                                                            <td class="remnode overflow">0x23473e46b0c2cc51d93d0e77ef6e7051918... <img src="../images/copy@2x.svg" /></td>
                                                            <td class="members">42</td>
                                                            <td class="uptime">47%</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>




            <div className="chk-rem mb-4 mt-5">
              <h2>{t(`CHECK_METATRAON_ZYTATRON_STATUS`)}</h2>
            </div>
            <div className="nodeStatusbackground">
              <div
                style={{ padding: "20px", width: "60%", marginLeft: "123px" }}
              >
                <div style={{ top: "22%" }}>
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
                  <div style={{ marginTop: "27px" }} className="ip-btn-left">
                    <button
                      className="btn custom-ip-btn"
                      onClick={this.handleSubmit}
                    >
                      {t("SUBMIT")}
                    </button>
                  </div>
                </div>
              </div>
              <div
                className="rametron-section"
                style={{ width: "40%", top: "132px" }}
              >
                <img
                  src="images/IMG 2@2x.png"
                  style={{ width: "448px", bottom: "76px", height: "382px" }}
                  alt=""
                />
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}

export default withTranslation()(NodeStatus);
