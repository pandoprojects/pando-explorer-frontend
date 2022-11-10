import React, { Component } from "react";
import { Link } from "react-router";
import { browserHistory } from 'react-router';
import cx from 'classnames';

import { averageFee, hash, age, date } from '../../common/helpers/blocks';

export default class BlockOverviewTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      backendAddress: this.props.backendAddress,
      blockHeight: 0,
      blocks: []
    };

  }
  static defaultProps = {
    includeDetails: true,
    truncate: 35,
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.blocks && nextProps.blocks.length && nextProps.blocks !== prevState.blocks) {
      return { blocks: nextProps.blocks };
    }

    return prevState;

  }
  componentDidMount() {

  }



  handleRowClick = (height) => {
    browserHistory.push(`/blocks/${height}`);
  }

  render() {
    const { className, includeDetails, truncate, t } = this.props;
    const { blocks } = this.state;

    // setTimeout(() => {


    return (
      <table className={cx("data block-table", className)}>
        <thead>
          <tr >
            <th className="height"><p>{t('HEIGHT')}</p></th>
            <th className="hash"><p>{t(`BLOCK_HASH`)}</p></th>
            {includeDetails &&
              <React.Fragment>
                <th className="age"><p>{t('AGE')}</p></th>
                <th className="fee"><p>{t('AVG_FEE')}</p></th>
              </React.Fragment>}
            <th className="txns "><p>{t('TXNS')}</p></th>
          </tr>
        </thead>
        <tbody style={{background:'06272c'}}>
          {blocks
            .sort((a, b) => b.height - a.height)
            .map(b => {
              return (
                <tr key={b.height}>
                  <td className="height">{b.height}</td>
                  <td className="hash overflow"><Link to={`/blocks/${b.height}`}>{hash(b, truncate ? truncate : undefined)}</Link></td>
                  {includeDetails &&
                    <React.Fragment>
                      <td className="age" title={date(b)}>{age(b)}</td>
                      <td className="fee">{(averageFee(b) / 1000000000).toFixed(2)} </td>
                    </React.Fragment>}
                  <td className="txns">{b.num_txs}</td>
                </tr>
              );
            })}
        </tbody>
      </table>);

  }
}
