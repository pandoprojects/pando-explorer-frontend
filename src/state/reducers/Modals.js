import * as actionTypes from "../types/Modals";

const INITIAL_STATE = {
    modals : []
};

export const modalsReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case actionTypes.SHOW_MODAL:{
            let { type, props } = action.modal;

            return Object.assign({}, state, {
                modals: [...state.modals, {
                    type: type,
                    props: props
                }]
            });
        }
        case actionTypes.HIDE_MODAL:{
            return Object.assign({}, state, {
                modals: state.modals.slice(0, -1)
            });
        }
        case actionTypes.HIDE_MODALS:{
            return Object.assign({}, state, {
                modals: []
            });
        }

        default:{
            return state
        }
    }
};