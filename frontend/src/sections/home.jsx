import React, { Component } from "react";
import { Link, withRouter } from 'react-router';
import { blocksService } from '../common/services/block';
import TransactionTable1 from "../common/components/transactions1-table";
import BlocksTable from "../common/components/blocks-table";
import BlocksTable1 from "../common/components/blocks-table1";
import TokenDashboard from "../common/components/token-dashboard";
import { priceService } from '../common/services/price';
import { transactionsService } from '../common/services/transaction';
import TransactionTable from "../common/components/transactions-table";
import LoadingPanel from '../common/components/loading-panel';
import { withTranslation } from "react-i18next";


const MAX_BLOCKS = 15
const NUM_TRANSACTIONS = 15;
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pandoInfo: null,
      PTXInfo: null,
      backendAddress: this.props.route.backendAddress,
      blockHeight: 0,
      blockInfoList: [],
      currentPageNumber: 1,
      totalPageNumber: 0,
      transactions: [],
      currentPage: 1,
      totalPages: 0,
      loading: false,
      price: { 'Pando': 0 }
    };
    this.receivedBlocksEvent = this.receivedBlocksEvent.bind(this);
    this.handleGetBlocksByPage = this.handleGetBlocksByPage.bind(this)
  }



  componentDidMount() {
    this.tst();
  }
  componentWillUnmount() {
  
  }
 

  tst() {
    this.setState({ loading: true })
    const { currentPageNumber } = this.state;
    const { currentPage } = this.state;
    blocksService.getBlocksByPage(currentPageNumber, MAX_BLOCKS)
      .then(res => {
        this.receivedBlocksEvent(res);
      }).catch(err => {

      })

    transactionsService.getTransactionsByPage(currentPage, NUM_TRANSACTIONS)
      .then(res => {
        if (res.data.type == 'transaction_list') {
          this.setState({
            transactions: _.orderBy(res.data.body, 'number', 'desc'),
            currentPage: _.toNumber(res.data.currentPageNumber),
            totalPages: _.toNumber(res.data.totalPageNumber),
            loading: false,
          })
        }

        

      })
      .catch(err => {
        this.setState({ loading: false });
      })
  }
  
  receivedBlocksEvent(data) {
    if (data.data.type == 'block_list') {
      this.setState({
        blockInfoList: data.data.body,
        currentPageNumber: data.data.currentPageNumber,
        totalPageNumber: data.data.totalPageNumber,
        loading: false

      })
    }
  }

  handleGetBlocksByPage(pageNumber) {
    blocksService.getBlocksByPage(pageNumber, MAX_BLOCKS)
      .then(res => {
        this.receivedBlocksEvent(res);
      }).catch(err => {
      })
  }
 
  render() {
    const { t } = this.props;
    const { pandoInfo, PTXInfo, blockInfoList, transactions, currentPage, totalPages, loading, price } = this.state;
    const { backendAddress } = this.props.route;
    return (
      <div className="content home1">

    
        <TokenDashboard type='PTX' t={t} tokenInfo={PTXInfo} />
        
        {this.state.loading ?

          <LoadingPanel /> :
          <div className="overview tab-bg mt-5">
            <button className="btn btn-success custom-btn hom-ref" title="Refresh" onClick={() => this.tst()} ><img src="/images/Layer 2.svg" alt="" /></button>
            <div className="row w-100">
            <div className="col-lg-6 clo-md-12">
              <div className="table-responsive">
                <div className="tbal-bl2">
                  <h2 className="page-title blocks"><Link to="/blocks"> <img style={{ paddingRight:'10px'}} src="./images/icons/Icon awesome-boxes.svg" alt="" />{t('BLOCKS')}</Link></h2>
                    <BlocksTable1
                    backendAddress={this.state.backendAddress} updateLive={true} t={t}
                    blocks={blockInfoList}
                    truncate={20} />
                    <div className="mor-lnk"><Link to="/blocks" className="more">{t('VIEW_MORE')}</Link></div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 clo-md-12">
              <div className="table-responsive">
                <div className="tbal-ty2" >
                  <h2 className="page-title transactions ui7"><Link to="/txs"><img src="./images/icons/Group 503.svg" className="hyfrg" alt="" />{t('TRANSACTIONS')}</Link></h2>
                  <TransactionTable1 transactions={transactions} updateLive={true} truncate={20} t={t} />
                  <div className="mor-lnk"><Link  to="/txs" className="more derf">{t('VIEW_MORE')}</Link></div>
                </div>
              </div>
            </div>
            </div>
          </div>
        }
      </div>
    );
  }
}
export default withTranslation()(Dashboard)