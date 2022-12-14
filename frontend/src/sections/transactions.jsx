import React, { Component } from "react";
import { browserHistory } from 'react-router';
import { transactionsService } from '../common/services/transaction';
import Pagination from "../common/components/pagination";
import TransactionTable from "../common/components/transactions-table";
import LoadingPanel from '../common/components/loading-panel';
import { withTranslation } from "react-i18next";


const NUM_TRANSACTIONS = 20;

class Transactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: [],
      currentPage: 1,
      totalPages: 0,
      loading: false,
      price: { 'Pando': 0, 'PTX': 0 }
    };
    this.onSocketEvent = this.onSocketEvent.bind(this);

  }
  componentWillUnmount() {
   
  }
  onSocketEvent(data) {
    let container = [];
    if (data) {
      container.push(data)
      let transactionsUpdated = (container || []).sort((a, b) => b.number - a.number);
      var a = this.state.transactions, b = transactionsUpdated
      var c = a.concat(b)
      var d = c.filter((value, index, self) =>
        index === self.findIndex((t) => (
          t.block_height === value.block_height && t.hash === value.hash
        ))
      )
      d = _.orderBy(d, 'number', 'desc')
      d.length = 20
      this.setState({ transactions: d })
      container = [];
    }

  }
  componentDidMount() {
    const { currentPage } = this.state;
    this.fetchData(currentPage);
    
  }
  tesdt(currentPage) {
    this.setState({ loading: true });
    this.setState({ currentPage: currentPage })
    transactionsService.getTransactionsByPage(currentPage, NUM_TRANSACTIONS)
      .then(res => {
        this.setState({ loading: false });
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
  fetchData(currentPage) {
    this.setState({ loading: true });
    this.tesdt(currentPage);
  }
  

  handlePageChange = (pageNumber) => {
    this.setState({ currentPage: pageNumber })
    this.fetchData(pageNumber);
  }

  handleRowClick = (hash) => {
    browserHistory.push(`/txs/${hash}`);
  }

  render() {
    const { t } = this.props
    const { transactions, currentPage, totalPages, loading, price } = this.state;
    return (
      <div className="content transactions">
        <div className="page-title transactions" > <img src="./images/Group 503.svg" alt=""  /> {t(`TRANSACTIONS`)} <button className="btn custom-btn" onClick={() => this.fetchData(this.state.currentPage)} title="Refresh" ><img src="/images/Layer 2.svg" alt="" /></button></div>
        {this.state.loading ?

          <LoadingPanel />
          :
          <>
            <TransactionTable transactions={transactions} price={price} t={t} />
            <Pagination
              size={'lg'}
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={this.handlePageChange}
              disabled={loading} />
          </>
        }

      </div>
    );
  }
}
export default withTranslation()(Transactions)