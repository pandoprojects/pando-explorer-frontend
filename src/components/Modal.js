import React from 'react'
import './Modal.css';
import {hideModal,hideModals} from "../state/actions/Modals";
import { store } from "../state";

// This component is about the Modal display call
export default class Modal extends React.Component {
    closeModal() {
       
        store.dispatch(hideModals());
    };
    render() {
       
       
        return (
            <div className="Modal">
               <a className="Modal__close-button" onClick={(e) =>{
                   e.preventDefault();this.closeModal();
                }}>
                    <img src="/img/icons/modal-x@2x.png"/>
                </a>

                {this.props.children}
            </div>
        )
    }
}

