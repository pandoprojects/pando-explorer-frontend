import React, { Component } from "react";
import { Link } from "react-router";
import cx from 'classnames';
import { formatCoin, sumCoin } from '../../common/helpers/utils';
import { withTranslation } from "react-i18next";


const TRUNC = 20;

class StakesTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSliced: true,
      stakeList: this.props.stakes.slice(0, TRUNC),
      remetron: {},
      currentPage: 1,
      totalPages: 0,
      loading: false

    };

  }
  static defaultProps = {

  }
  componentDidMount() {
  }
  toggleList() {
    if (this.state.isSliced) {
      this.setState({ stakeList: this.props.stakes, isSliced: false })
    } else {
      this.setState({ stakeList: this.props.stakes.slice(0, TRUNC), isSliced: true })
    }
  }

  componentWillUpdate(nextProps) {
    if (nextProps.stakes.length !== this.props.stakes.length) {
      this.setState({ stakeList: nextProps.stakes.slice(0, TRUNC), isSliced: true })
    }
  }

  render() {
    const { className, type, truncate, totalStaked, stakes, t } = this.props;
    const { stakeList, isSliced, remetron } = this.state;
  
    let colSpan = type === 'node' ? 4 : 4;

    if (type === 'validators') {
      return (

        <div className="stakes trnaj">
          <div className="title mt-5"><p className="ac-det">{t(`TOP_ZYTATRON_NODES`)}</p></div>
          <div className="txt-de2 mt-4 table-responsive">
          <table className={cx("data txn-table2", className)}>
            <thead style={{color:"aqua"}}>
              <tr onClick={this.toggleList.bind(this)}>
                <th className="address"><p>{t(`ADDRESS`)}</p></th>
                <th className="node-type"><p>{t(`TYPE`)}</p></th>
                <th className="staked"><p>{t(`TOKENS_STAKED`)}</p></th>
                <th className="staked-prct"><p>% {t(`STAKED`)}</p></th>
              </tr>
            </thead>
            <tbody className="stake-tb">
              {_.map(stakeList, record => {
                const address = record.holder;
                if (record.type === 'vcp') {
                  return (
                    <tr key={address}>
                      <td className="address"><Link to={`/account/${address}`}>{_.truncate(address, { length: truncate })}</Link></td>
                      <td className={cx("node-type", record.type)}>{t(`ZYTATRON`)}</td>
                      <td className="staked"><div className="currency PandoWei">{formatCoin(record.amount)} </div></td>
                      <td className="staked-prct">{(record.amount / totalStaked * 100).toFixed(2)}%</td>
                    </tr>);
                }
              })}
              {stakes.length > TRUNC &&
                <tr>
                  <td className="arrow-container" colSpan={colSpan} onClick={this.toggleList.bind(this)}>
                    {t(`VIEW`)} {isSliced ? `${t(`MORE`)}` : `${t(`LESS`)}`}
                  </td>
                </tr>
              }
              <tr><td className="empty"></td></tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                {/* {type === 'node' && <td></td>}
                  <td className="staked"><div className="currency PandoWei">{formatCoin(totalStaked*5)}</div></td>
                  <td className="staked-prct">100%</td> */}
              </tr>
            </tbody>
          </table>
          </div>
        </div>);

    }
    else if (type === 'guardian') {
      return (

        <div className="stakes trnaj">
          <div className="title mt-5"><p className="ac-det">{t(`TOP_METATRON_NODES`)}</p></div>
          <div className="txt-de2 mt-4 table-responsive">
          <table className={cx("data txn-table2", className)}>
            <thead>
              <tr onClick={this.toggleList.bind(this)}>
                <th className="address"><p>{t(`ADDRESS`)}</p></th>
                <th className="node-type"><p>{t(`TYPE`)}</p></th>
                <th className="staked"><p>{t(`TOKENS_STAKED`)}</p></th>
                <th className="staked-prct"><p>% {t(`STAKED`)}</p></th>
              </tr>
            </thead>

            <tbody className="stake-tb">
              {_.map(stakeList, record => {

                const address = record.holder;
                if (record.type == 'gcp') {
                  return (
                    <tr key={address}>
                      <td className="address"><Link to={`/account/${address}`}>{_.truncate(address, { length: truncate })}</Link></td>
                      <td className={cx("node-type", record.type)}>{t(`METATRON`)}</td>
                      <td className="staked"><div className="currency PandoWei">{formatCoin(record.amount)}</div></td>
                      <td className="staked-prct">{(record.amount / totalStaked * 100).toFixed(2)}%</td>
                    </tr>);
                }
              })}
              {stakes.length > TRUNC &&
                <tr>
                  <td className="arrow-container" colSpan={colSpan} onClick={this.toggleList.bind(this)}>
                    {t(`VIEW`)} {isSliced ? `${t(`MORE`)}` : `${t(`LESS`)}`}
                  </td>
                </tr>
              }
              <tr><td className="empty"></td></tr>
              {stakeList.length > 1 &&
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>


                </tr>
              }

              {stakeList.length < 2 &&
                <tr>
                  <td></td>

                  <td></td>
                  <td>{t(`NO_DATA_AVAILABLE`)}</td>
                  <td></td>

                </tr>
              }

            </tbody>
          </table>
          {/* <div className="title mt-1 csdcsd"> {t(`TOTAL STAKE`)} : <span className="ptx"> {formatCoin(totalStaked)} PTX </span></div> */}

          </div>
        </div >);
    }
    else if(type === 'rametron')
    {
      return (

        <div className="stakes trnaj">
        <div className="title mt-5"><p className="ac-det">{t(`TOP_RAMETRON_NODES`)}</p></div>
        <div className="txt-de2 mt-4 table-responsive">
        <table  className={cx("data txn-table2", className)}>
          <thead>
            <tr onClick={this.toggleList.bind(this)}>
              <th className="address"><p>{t(`ADDRESS`)}</p></th>
              <th className="node-type"><p>{t(`TYPE`)}</p></th>
              <th className="staked"><p>{t(`TOKENS_STAKED`)}</p></th>
              <th className="staked-prct"><p>% {t(`STAKED`)}</p></th>
            </tr>
          </thead>

          <tbody className="stake-tb">
            {_.map(stakeList, record => {

              const address = record.holder;
              if (record.type == 'rametronenterprisep') {
                return (
                  <tr key={address}>
                    <td className="address"><Link to={`/account/${address}`}>{_.truncate(address, { length: truncate })}</Link></td>
                    <td className={cx("node-type", record.type)}>{t(`RAMETRON`)}</td>
                    <td className="staked"><div className="currency PandoWei">{formatCoin(record.amount)}</div></td>
                    <td className="staked-prct">{(record.amount / totalStaked * 100).toFixed(2)}%</td>
                  </tr>);
              }
            })}
            {stakes.length > TRUNC &&
              <tr>
                <td className="arrow-container" colSpan={colSpan} onClick={this.toggleList.bind(this)}>
                  {t(`VIEW`)} {isSliced ? `${t(`MORE`)}` : `${t(`LESS`)}`}
                </td>
              </tr>
            }
            <tr><td className="empty"></td></tr>
            {stakeList.length > 1 &&
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>


              </tr>
            }

            {stakeList.length < 2 &&
              <tr>
                <td></td>

                <td></td>
                <td>{t(`NO_DATA_AVAILABLE`)}</td>
                <td></td>

              </tr>
            }

          </tbody>
        </table>
        </div>
        <div className="txt-de2 mt-4">
        <div className="title mt-1 gsrf"><p>{t(`TOTAL STAKE`)}</p> <p className="ptx"><img src="../images/PTX LOGO.svg"/> {formatCoin(totalStaked)} PTX </p></div>
        </div>

      </div >
      )
    }



    else {
      return (

        <div className="stakes trnaj">
           {/* <h3 className="blk-det"> <img src="../images/Icon awesome-boxes.svg" alt="" srcset="" /> {t(`BLOCK_DETAILS`)}</h3> */}
          <div className="title mt-5 u7u"> {type === 'node' ? `${t <h2>(`TOP_ZYTATRON_METATRON_NODES`)}` :`${t(`TOP_STAKING_WALLETS`)}`}</div>
          <div className="txt-de2 jh23 mt-5 table-responsive">
          <table className={cx("data txn-table2 huydhd", className)}>
            <thead>
              <tr onClick={this.toggleList.bind(this)}>

                <th className="address"><p>{t(`ADDRESS`)}</p></th>
                {/* {type === 'node' && <th className="node-type">{t(`TYPE`)}</th>} */}
                <th className="staked"><p>{t(`TOKENS_STAKED`)}</p></th>
                <th className="staked-prct"><p>% {t(`STAKED`)}</p></th>
              </tr>
            </thead>
            <tbody className="stake-tb">
              {_.map(stakeList, record => {
                const address = type === 'node' ? record.holder : record.source;
                return (
                  <tr key={address}>
                    <td className="address"><Link to={`/account/${address}`}>{_.truncate(address, { length: truncate })}</Link></td>
                    {type === 'node' && <td className={cx("node-type", record.type)}>{record.type === 'vcp' ? `${t(`ZYTATRON`)}` : `${t(`METATRON`)}`}</td>}
                    <td className="staked"><div className="currency PandoWei">{formatCoin(record.amount)}</div></td>
                    <td className="staked-prct">{(record.amount / totalStaked * 100).toFixed(2)}%</td>
                  </tr>);
              })}
              {stakes.length > TRUNC &&
                <tr>
                  <td className="arrow-container" colSpan={colSpan} onClick={this.toggleList.bind(this)}>
                    {t(`VIEW`)} {isSliced ? `${t(`MORE`)}` : `${t(`LESS`)}`}
                  </td>
                </tr>
              }
              <tr><td className="empty"></td></tr>
              
          

            <tr>
                <td style={{textTransform:'uppercase'}}>{t(`TOTAL_STAKED_TOKENS`)}</td>
                {type === 'node' && <td></td>}
                <td className="staked"><div className="currency PandoWei">{formatCoin(totalStaked)}</div></td>
                <td style={{padding:'13px'}} className="staked-prct">100%</td>
              </tr>
              </tbody>
          </table>
          </div>
        </div>);
    }



  }
}

export default withTranslation()(StakesTable)
