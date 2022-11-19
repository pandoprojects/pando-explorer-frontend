import React from 'react'
import './StakePurposeSelector.css';

const classNames = require('classnames');


// This is all about the purpose ,title isDisabled ,onclick method based on the condition
export class StakePurposeSelectorItem extends React.Component {
    render() {
        const { purpose, title, subtitle, isDisabled, isSelected, onClick, t } = this.props;
        const className = classNames("StakePurposeSelectorItem", {
            "StakePurposeSelectorItem--is-selected": isSelected,
            "StakePurposeSelectorItem--is-disabled": isDisabled
        });
        return (
            <a className={className}
                onClick={() => {
                    if (!isDisabled && onClick) {
                        onClick(purpose);
                    }
                }}
            >
                <div className={"StakePurposeSelectorItem__title"}>{t(title)}</div>
                <div className={"StakePurposeSelectorItem__subtitle"}>{t(subtitle)}</div>
            </a>
        )
    }
}

export default class StakePurposeSelector extends React.Component {
    render() {
        return (
            <div className={"StakePurposeSelector"}>
                {this.props.children}
            </div>
        )
    }
}
