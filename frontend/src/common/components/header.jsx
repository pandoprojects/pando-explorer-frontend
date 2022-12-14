import React, { Component } from "react";
import { browserHistory, Link } from "react-router";
import { withTranslation } from "react-i18next";
import "../../index.css";
import { lang, Languages } from "../constants";
import config from "../../config";
class Header extends Component {

  constructor(props) {
    let activelink = "";
    if (window.location.pathname.includes("block")) {
      activelink = "block";
    } else if (window.location.pathname.includes("txs")) {
      activelink = "txs";
    } else if (window.location.pathname.includes("stakes")) {
      activelink = "stakes";
    } else if (window.location.pathname.includes("nodes")) {
      activelink = "nodes";
    } else if (window.location.pathname.includes("public-node")) {
      activelink = "public-node";
    } else {
      activelink = "";
    }

    let selectedLanguage = localStorage.getItem('currentLang')
    let selectedLanguageValue = localStorage.getItem('currentLanguage')
    
    if(!(!!selectedLanguage)){
        selectedLanguage = 'en'
        selectedLanguageValue = 'English'
    }
    super(props);
    this.state = {
      addClass: false,
      lang: lang,
      languages: Languages,
      selectedLanguage: selectedLanguageValue.toString(),
      activeLink: activelink,
    };
    this.props.i18n.changeLanguage(selectedLanguage);

    this.handleHeader = this.handleHeader.bind(this);
  }

  handleHeader(val) {
    this.setState({ addClass: !this.state.addClass });
  }

  changeLanguage = (lang) => {
    for (const key in this.state.languages) {
      if (key === lang) {
        this.setState({ selectedLanguage: lang });
        localStorage.setItem('currentLang',this.state.languages[key])
        localStorage.setItem('currentLanguage',lang)
        this.props.i18n.changeLanguage(this.state.languages[key]);
      }
    }
  };

  handleClick = (id) => {
    $('.navbar-collapse').collapse('hide');
    this.setState({ activeLink: id });
  };
  render() {
    const { t } = this.props;
    let boxClass = [""];
    if (this.state.addClass) {
      boxClass.push("active-nav");
    }
    return (
      <div className="">
        <nav className="navbar navbar-expand-lg navbar-light pando-head fixed-top">
          <Link
            to="/"
            className="navbar-brand"
            onClick={() => this.handleClick(" ")}
          >
            <img
              className="logo"
              src="/images/PANDOPROJECT LOGO.svg"
              height="50"
            
              alt=""
            />{" "}
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li
                onClick={() => this.handleClick("block")}
                className={
                  this.state.activeLink === "block"
                    ? " nav-item active"
                    : "nav-item "
                }
              
              >
                <Link
                  to="/blocks"
                  className="nav-item"
                  onClick={this.handleHeader}
                >
                  <p>
                    <img
                      src="/images/Icon awesome-boxes.svg"
                      className="fr-d"
                    />
                    <img
                      src="/images/Icon awesome-boxes3.svg"
                      className="fr-m"
                    />
                  </p>
                  {t("BLOCKS")}
                </Link>
              </li>
              <li
                onClick={() => this.handleClick("txs")}
                className={
                  this.state.activeLink === "txs"
                    ? " nav-item active"
                    : "nav-item "
                }
             
              >
                <Link
                  to="/txs"
                  className="nav-item"
                  onClick={this.handleHeader}
                >
                  <p>
                    <img src="/images/Group 503.svg" className="fr-d" />
                    <img src="/images/Group 11432.svg" className="fr-m" />
                  </p>
                  {t("TRANSACTIONS")}
                </Link>
              </li>
              <li
                onClick={() => this.handleClick("stakes")}
                className={
                  this.state.activeLink === "stakes"
                    ? " nav-item active"
                    : "nav-item "
                }
              
              >
                <Link
                  to="/stakes"
                  className="nav-item"
                  onClick={this.handleHeader}
                >
                  <p>
                    <img
                      src="/images/Icon awesome-coins.svg"
                      className="fr-d"
                    />
                    <img
                      src="/images/Icon awesome-coins1.svg"
                      className="fr-m"
                    />
                  </p>
                  {t("STAKES")}
                </Link>
              </li>
              <li
                onClick={() => this.handleClick("nodes")}
                className={
                  this.state.activeLink === "nodes"
                    ? " nav-item active"
                    : "nav-item "
                }
              
              >
                <Link
                  to="/nodes"
                  className="nav-item"
                  onClick={this.handleHeader}
                >
                  <p>
                    <img src="/images/Group 124.svg" className="fr-d" />
                    <img src="/images/Group 1141.svg" className="fr-m" />
                  </p>
                  {t("TOP NODE")}
                </Link>
              </li>
              <li
                onClick={() => this.handleClick("public-node")}
                className={
                  this.state.activeLink === "public-node"
                    ? " nav-item active"
                    : "nav-item "
                }
              
              >
                <Link
                  to="/public-node"
                  className="nav-downloadsitem"
                  onClick={() => this.handleHeader("public-node")}
                >
                  <p>
                    <img src="/images/Path 176.svg" className="pub78 fr-d" />
                    <img src="/images/Group 1142.svg" className="fr-m" />
                  </p>
                  {t("PUBLIC NODE")}
                </Link>
              </li>
              <li className=" nav-item" onClick={() => this.handleClick("")}>
                
                <a
                  href="https://pandoproject.org/announcements/ "
                  target="_blank"
                >
                  <p>
                    <img src="/images/Path 962.svg" className="pub78 fr-d" />
                    <img src="/images/Path 962.svg" className="fr-m" />
                  </p>
                  {t(`ANNOUNCEMENTS`)}
                </a>
              </li>
            </ul>
            <form className="firu6 my-2 my-lg-0 do-bth">
              <div className="test-nt" >
                <a href={config.redirectionUrl}
                className="t4r" target="_blank">
                  {config.network}
                  <span> {config.version}</span>
                  
                </a>
              </div>

              {/* download button */}
              <Link to="/downloads"  onClick={() => this.handleClick("")}>
              <div className="rametronDownloads" 
           >
              
                  <img
                    src="../images/Path 847.svg"
                    height="20"
                    style={{ marginRight: "11px", left: "2px" }}
                  />
                  {t("DOWNLOAD")}
              
              </div>
              </Link>
              {/* Language dropdown */}

              <div className={boxClass.join(" ") + " nav-search"}>
                <div className="dd-button search-select">
                  <select
                    onChange={(e) => this.changeLanguage(e.target.value)}
                    style={{ border: "none", height: "49" }}
                    value={this.state.selectedLanguage}>
                    {this.state.lang &&
                      this.state.lang.map((val, index) => (
                        <option className="dd-menu" value={val} key={index}>
                          {val}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </form>
          </div>
        </nav>
        
      </div>
    );
  }
}
export default withTranslation()(Header);
