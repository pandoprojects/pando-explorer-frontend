import React, { Component } from "react";
import { blocksService } from '../common/services/block';
import BlocksTable from "../common/components/blocks-table";
import Pagination from "../common/components/pagination";
import LoadingPanel from '../common/components/loading-panel';
import { withTranslation } from "react-i18next";


const MAX_BLOCKS = 20;

class Blocks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blockHeight: 0,
      blockInfoList: [],
      currentPageNumber: 1,
      totalPageNumber: 0,
      count: 0,
      loading: true
    };
   ;
    this.receivedBlocksEvent = this.receivedBlocksEvent.bind(this);
    this.handleGetBlocksByPage = this.handleGetBlocksByPage.bind(this);
  }

  componentDidMount() {
    const { currentPageNumber } = this.state;
    this.test(currentPageNumber)
  }
  test(currentPageNumber) {
    this.setState({ loading: true });
    this.setState({ currentPageNumber: currentPageNumber })
    blocksService.getBlocksByPage(currentPageNumber, MAX_BLOCKS)
      .then(res => {

        this.receivedBlocksEvent(res);
        this.setState({ loading: false });

      }).catch(err => {

      })

  }
  // onSocketEvent(data) {
  //   let transactionsUpdated = [];
  //   if (data) {
  //     transactionsUpdated.push(data);
  //     var a = this.state.blockInfoList, b = transactionsUpdated
  //     var c = a.concat(b)
  //     var d = c.filter((value, index, self) =>
  //       index === self.findIndex((t) => (
  //         t.height === value.height
  //       ))
  //     )

  //     d = d.sort(function (a, b) {
  //       return b.height - a.height;
  //     });
  //     d.length = 20
  //     this.setState({ blockInfoList: d })
  //     transactionsUpdated = [];

  //   }
  // }
  componentWillUnmount() {
    // if (this.socket)
    //   this.socket.disconnect();
  }
  test1(currentPageNumber) {
    this.setState({ loading: true });
    this.setState({ currentPageNumber: currentPageNumber })
    blocksService.getBlocksByPage(currentPageNumber, MAX_BLOCKS)
      .then(res => {
        this.setState({ loading: false });

        this.receivedBlocksEvent(res);


        // }
      }).catch(err => {

      })

  }
  receivedBlocksEvent(data) {
    if (data.data.type == 'block_list') {
      this.setState({
        blockInfoList: data.data.body,
        totalPageNumber: data.data.totalPageNumber
      })

    }
  }
  handleGetBlocksByPage(pageNumber) {
    this.test1(pageNumber)
  }
  render() {
    const { t } = this.props;
    const { blockInfoList } = this.state;
    let { currentPageNumber, totalPageNumber } = this.state;
    currentPageNumber = Number(currentPageNumber);
    totalPageNumber = Number(totalPageNumber);
    return (
      <div className="content blocks">
        <div className="page-title blocks"><img src="../images/icons/Icon awesome-boxes.svg" /> {t('BLOCKS')}  <button className="btn custom-btn" onClick={() => this.test(this.state.currentPageNumber)} title="Refresh" ><img src="/images/Layer 2.svg" alt="" /></button></div>
       
        <div className="blk9">
        {this.state.loading ?
          <LoadingPanel /> :
          <>
            <BlocksTable
              blocks={blockInfoList}
              truncate={20}
              t={t}
            />
            <Pagination
              size={'lg'}
              totalPages={totalPageNumber}
              currentPage={currentPageNumber}
              onPageChange={this.handleGetBlocksByPage}
            />
          </>
        }
        </div>
      </div>
    );
  }
}
export default withTranslation()(Blocks)