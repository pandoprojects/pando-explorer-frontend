import React, { Component } from "react";
import { transactionsService } from '../common/services/transaction';
import { apiService } from '../common/services/api';


export default class Check extends Component {
  constructor(props) {
    super(props);
    this.searchAddress = React.createRef();
    this.searchStartTime = React.createRef();
    this.searchEndTime = React.createRef();
    this.handleSearch = this.handleSearch.bind(this);
    this.state = {
      result: 0,
    };
  }
  handleEnterKey(e) {
    if (e.key === 'Enter') {
      this.handleSearch();
    }
  }
  async handleSearch() {
    this.setState({ result: 'processing' })
    const address = this.searchAddress.value;
    const startTime = new Date(this.searchStartTime.value).getTime() / 1000;
    const endTime = new Date(this.searchEndTime.value).getTime() / 1000;
    if (!isNaN(startTime) && !isNaN(endTime)) {
      if (address !== '') {
        apiService.get(`/accountTx/tmp/${address}`, { params: { type: 5, startTime, endTime } })
          .then(res => {
            this.setState({ result: res.data.total })
          })
          .catch(err => {
          })
      } else {
        apiService.get(`/blocks/tmp`, { params: { type: 5, startTime, endTime } })
          .then(res => {
            this.setState({ result: res.data.total })
          })
          .catch(err => {
          })
      }
    } else {
      this.setState({ result: 'Error' })

    }
    // apiService.get(`/accountTx/counter/${address}`, { params: { type: 5, startTime, endTime, isEqualType: true } })
    //   .then(async res => {
    //    
    //     let result = 0;
    //     const total = res.data.total;
    //     let counter = 1;
    //     const time = Math.floor(total / 100);
    //     const rest = total - time * 100;    //    
    //     if (total !== 0) {
    //       this.setState({ result: 'processing' })
    //       for (counter; counter < time + 1; counter++) {
    //         await apiService.get(`accounttx/${address}`, { params: { type: 5, pageNumber: counter, limitNumber: 100, isEqualType: true } })
    //           .then(res => {    //           
    //             res.data.body.forEach(tx => {
    //               if (!tx.data.source) {  }
    //               result += (tx.data.source.coins.PTXWei - '0') / 1000000000000000000;
    //             });
    //           })
    //       }
    //       await apiService.get(`accounttx/${address}`, { params: { type: 5, pageNumber: time + 1, limitNumber: rest, isEqualType: true } })
    //         .then(res => {
    //          
    //           res.data.body.forEach(tx => {
    //             if (!tx.data.source) { }
    //             result += (tx.data.source.coins.PTXWei - '0') / 1000000000000000000;
    //           });
    //         })
    //       this.setState({ result: result })
    //     }
    //   })
  }
  render() {
    return (
      <div className="content check">
        <div className="search">
          <input type="text" className="search-input" placeholder="Address" ref={input => this.searchAddress = input} onKeyPress={e => this.handleEnterKey(e)} />
          <input type="text" className="search-input" placeholder="YYYY-MM-DDTHH:MM:SS" ref={input => this.searchStartTime = input} onKeyPress={e => this.handleEnterKey(e)} />
          <input type="text" className="search-input" placeholder="YYYY-MM-DDTHH:MM:SS" ref={input => this.searchEndTime = input} onKeyPress={e => this.handleEnterKey(e)} />
        </div>
        <div>Date input example: 2019-04-20T00:00:00</div>
        <div>Total earned PTX: {this.state.result}</div>
      </div>
    );
  }
}