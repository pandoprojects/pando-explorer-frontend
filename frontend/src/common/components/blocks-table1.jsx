import React, { Component } from "react";
import { Link } from "react-router";
import { browserHistory } from 'react-router';
import cx from 'classnames';

import { averageFee, hash, age, date } from '../../common/helpers/blocks';

export default class BlockOverviewTable1 extends Component {

    constructor(props) {
        super(props);
        this.state = {
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
    componentWillUnmount() {
       
    }
    

    handleRowClick = (height) => {
        browserHistory.push(`/blocks/${height}`);
    }

    render() {
        const { className, includeDetails, truncate, t } = this.props;
        const { blocks } = this.state;
      
        return (
            <table style={{backgrounColor:"red"}} className={cx("data block-table", className)}>
                <thead>
                    <tr>
                        <th className="height hig"><p>{t('HEIGHT')}</p></th>
                        <th className="hash has1"><p>{t('BLOCK_HASH')}</p></th>
                      
                        <th className="txns txn1"><p>{t(`TXNS`)}</p></th>
                    </tr>
                </thead>
                <tbody style={{background:'0e4847d1'}}>
                    {blocks
                        .sort((a, b) => b.height - a.height)
                        .map(b => {
                            return (
                                <tr key={b.height}>
                                    <td className="height">{b.height}</td>
                                    <td className="hash overflow"><Link to={`/blocks/${b.height}`}>{hash(b, truncate ? truncate : undefined)}</Link></td>
                                    {/* {includeDetails &&
                                        <React.Fragment>
                                            <td className="age" title={date(b)}>{age(b)}</td>
                                            <td className="fee">{averageFee(b)} Gwei</td>
                                        </React.Fragment>} */}
                                    <td className="txns">{b.num_txs}</td>
                                </tr>
                            );
                        })}
                </tbody>
            </table>);
    }
}
