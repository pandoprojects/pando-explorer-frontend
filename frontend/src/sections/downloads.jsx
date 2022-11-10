import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import stakeService from "react";
import * as moment from "moment";
import LoadingPanel from "../common/components/loading-panel";
import { withTranslation } from "react-i18next";

export default class downloads extends Component {
  linuxArmUrl = `https://build.pandoproject.org/Rametron_4.1.1_amd64-arm.deb`;
  macArmUrl = `https://build.pandoproject.org/Rametron-4.1.1-arm64.dmg`;
  window32Url = `https://build.pandoproject.org/Rametron Setup 4.1.1-32.exe`;
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
          <div className="container">
            <div class="row">
              <div className="col-md-12">
                <div className="searchbar-flex">
                  {/* <input type="" name="" placeholder="Search..." />
                  <select
                    className="form-select"
                    aria-label="Default select example"
                  >
                    <option selected>Address</option>
                    <option value="1">Blocks</option>
                    <option value="2">Transactions</option>
                    <option value="3">Block Height</option>
                  </select> */}
                </div>
              </div>
              <div className="col-md-4">
                <div className="h-100">
                  <div className="download-box">
                    <div className="title">
                      Rametron
                      <img src="./images/Group 4216.svg" />
                    </div>
                    <div className="des">Download Rametron Lite</div>
                    <button
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      onClick={this.openModal}
                    >
                      Download Now
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="h-100">
                  <div className="download-box">
                    <div className="title">
                      Rametron
                      <img src="./images/Group 4227.svg" />
                    </div>
                    <div className="des">Download Rametron Pro</div>
                    <button
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      onClick={this.openModal}
                    >
                      Download Now
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="h-100">
                  <div className="download-box">
                    <div className="title">
                      Rametron
                      <img src="./images/Group 4228.svg" />
                    </div>
                    <div className="des">Download Rametron Enterprise</div>
                    <button
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      onClick={this.openModal}
                    >
                      Download Now
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="h-100">
                  <div className="download-box">
                    <div className="title">
                      Rametron
                      <img src="./images/Group 4229.svg" />
                    </div>
                    <div className="des">Download Rametron Mobile</div>
                    <button
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      onClick={this.openModal}
                    >
                      Download Now
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="h-100">
                  <div className="download-box">
                    <div className="title">
                      Zytatron
                      <img src="./images/Zytatron.svg" />
                    </div>
                    <div className="des">Download Zytatron</div>
                    <button
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      onClick={this.openModal}
                    >
                      Download Now
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="h-100">
                  <div className="download-box">
                    <div className="title">
                      Metatron
                      <img src="./images/Metatron.svg" />
                    </div>
                    <div className="des">Download Rametron</div>
                    <button
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      onClick={this.openModal}
                    >
                      Download Now
                    </button>
                  </div>
                </div>
              </div>

              <Modal show={this.state.isOpen} onHide={this.closeModal}>
                <Modal.Header>
                  <Modal.Title className="modal-header">Download</Modal.Title>
                </Modal.Header>
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
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="box">
                  <div className="row">
                    <div class="col-md-7">
                      <div className="min-box">
                        <h4>Pando Network Rametron Node</h4>
                        <p>
                          Earn PTX by activating Rametron in the Pando Network
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
                          <a href="./images/Pando Blockchain Setup.pdf">
                            <button className="allbutton">All-in-one Guide</button>
                          </a>

                          <a href="https://www.youtube.com/playlist?list=PL9b5rPhmAkZDLtTrP522uTIGSrpKmJo7_">
                            <button className="allbutton">Video Guide</button>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="img">
                        <img src="./images/IMG 1@2x.png" alt="" srcset="" />
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
