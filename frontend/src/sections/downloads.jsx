import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import * as moment from "moment";
import LoadingPanel from "../common/components/loading-panel";
import { withTranslation } from "react-i18next";
import config from "../config";
class downloads extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rametronVersion: null,
      loading: true,
      isOpen: false,
    };
  }

  // componentDidMount() {
  //   this.setState({ loading: true });
  //   stakeService.getRametronVersions().then((res) => {
  //     if (res.isSuccess) {
  //       this.setState({ loading: false });
  //       this.setState({
  //         rametronVersion: res.data.sort((a, b) => a.id - b.id),
  //       });
  //     }
  //   });
  // }

  openModal = () => this.setState({ isOpen: true });
  closeModal = () => this.setState({ isOpen: false });

  render() {
    const { t } = this.props;
    return (
      <div className="downloadContainer">
        <section className="download-page">
          <div className="container-fluid">
            <div class="row">
             
              <div className="col-md-4">
                <div className="h-100">
                  <div className="download-box">
                    <div className="title">
                      {t(`RAMETRON`)}
                      <img src="./images/Group 4216.svg" />
                    </div>
                    <div className="des">{t(`DOWNLOAD RAMETRON LITE`)}</div>
                    <button
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      onClick={this.openModal}
                    >
                      {t(`DOWNLOAD NOW`)} 
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="h-100">
                  <div className="download-box">
                    <div className="title">
                    {t(`RAMETRON`)}
                      <img src="./images/Group 4227.svg" />
                    </div>
                    <div className="des">{t(`DOWNLOAD RAMETRON PRO`)}</div>
                    <button
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      onClick={this.openModal}
                    >
                      {t(`DOWNLOAD NOW`)}
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="h-100">
                  <div className="download-box">
                    <div className="title">
                    {t(`RAMETRON`)}
                      <img src="./images/Group 4228.svg" />
                    </div>
                    <div className="des">{t(`DOWNLOAD RAMETRON ENTERPRISE`)}</div>
                    <button
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      onClick={this.openModal}
                    >
                      {t(`DOWNLOAD NOW`)}
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="h-100">
                  <div className="download-box">
                    <div className="title">
                    {t(`RAMETRON`)}
                      <img src="./images/Group 4229.svg" />
                    </div>
                    <div className="des"> {t(`DOWNLOAD RAMETRON MOBILE`)}</div>
                    <button
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      onClick={this.openModal}
                    >
                      {t(`DOWNLOAD NOW`)}
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="h-100">
                  <div className="download-box">
                    <div className="title">
                       {t(`ZYTATRON`)}
                      <img src="./images/Zytatron.svg" />
                    </div>
                    <div className="des">  {t(`DOWNLOAD ZYTATRON`)}</div>
                    <button
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      onClick={this.openModal}
                    >
                     {t(`DOWNLOAD NOW`)}
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="h-100">
                  <div className="download-box">
                    <div className="title">
                      {t(`METATRON`)}
                      <img src="./images/Metatron.svg" />
                    </div>
                    <div className="des">{t(`DOWNLOAD RAMETRON`)}</div>
                    <button
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      onClick={this.openModal}
                    >
                      {t(`DOWNLOAD NOW`)}
                    </button>
                  </div>
                </div>
              </div>

              <Modal show={this.state.isOpen} onHide={this.closeModal}>
                {/* <Modal.Header>
                  <Modal.Title className="modal-header">{t(`DOWNLOAD`)}</Modal.Title>
                </Modal.Header> */}
                <Modal.Body>
                  Coming Soon...!
                </Modal.Body>
                <Modal.Footer>
                  <Button className="modalButton" onClick={this.closeModal}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          </div>
        </section>

        <section className="download-page-network">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <div className="box">
                  <div className="row">
                    <div class="col-md-7">
                      <div className="min-box">
                        <h4>{t(`PANDO_NETWORK_RAMETRON_NODE`)}</h4>
                        <p>
                        {t(`EARN_PTX_BY_ACTIVATING_RAMETRON_IN_THE_PANDO_NETWORK`)} 
                        </p>
                        <div className="icon-flex">
                          <button>
                            <img src="https://www.freeiconspng.com/thumbs/windows-icon-png/cute-ball-windows-icon-png-16.png" />
                            Windows
                          </button>
                          <button>
                            <img src="https://www.freeiconspng.com/thumbs/mac-icon/brushed-metal-apple-mac-icon-29.png" />
                            Mac
                          </button>
                          <button>
                            <img src="https://cdn-icons-png.flaticon.com/512/6124/6124995.png" />
                            Linux <span>Ubuntu 20.04</span>
                          </button>
                        </div>
                        <div className="btn-flex">
                          <a href={config.allinoneguide} target="_blank">
                            <button className="allbutton">{t(`ALL IN ONE GUIDE`)}</button>
                          </a>

                          <a href="https://www.youtube.com/playlist?list=PL9b5rPhmAkZDLtTrP522uTIGSrpKmJo7_"  target="_blank">
                            <button className="allbutton">{t(`VIDEO GUIDE`)}</button>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="img">
                        <img src="./images/IMG 1@2x.png" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}


export default withTranslation()(downloads);