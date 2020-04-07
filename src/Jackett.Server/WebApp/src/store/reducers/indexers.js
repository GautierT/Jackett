import {FETCH_INDEXERS_PENDING, FETCH_INDEXERS_SUCCESS, FETCH_INDEXERS_ERROR} from '../actions/indexers';

const initialState = {
    pending: false,
    indexers: [],
    error: null
}

export default function indexersReducer(state = initialState, action) {
    switch(action.type) {
        case FETCH_INDEXERS_PENDING:
            return {
                ...state,
                pending: true
            }
        case FETCH_INDEXERS_SUCCESS:
            return {
                ...state,
                pending: false,
                indexers: action.indexers
            }
        case FETCH_INDEXERS_ERROR:
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
export const getIndexers = state => state.indexers.indexers;
export const getIndexersPending = state => state.indexers.pending;
export const getIndexersError = state => state.indexers.error;
