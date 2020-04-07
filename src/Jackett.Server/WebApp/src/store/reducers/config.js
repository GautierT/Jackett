import {FETCH_CONFIG_PENDING, FETCH_CONFIG_SUCCESS, FETCH_CONFIG_ERROR} from '../actions/config';

const initialState = {
    pending: false,
    config: [],
    error: null
}

export default function configReducer(state = initialState, action) {
    switch(action.type) {
        case FETCH_CONFIG_PENDING: 
            return {
                ...state,
                pending: true
            }
        case FETCH_CONFIG_SUCCESS:
            return {
                ...state,
                pending: false,
                config: action.config
            }
        case FETCH_CONFIG_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            }
        default: 
            return state;
    }
}

// Selectors
export const getConfig = state => state.config.config;
export const getConfigPending = state => state.config.pending;
export const getConfigError = state => state.config.error;
