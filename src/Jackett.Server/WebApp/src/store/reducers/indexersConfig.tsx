import {
    FETCH_INDEXERS_ERROR,
    FETCH_INDEXERS_PENDING,
    FETCH_INDEXERS_SUCCESS,
    IndexersConfigState,
    IndexersConfigActionTypes
} from "../types/indexersConfig";

//
// Initial state

const initialState: IndexersConfigState = {
    isLoaded: false,
    error: "",
    configuredIndexers: [],
    unConfiguredIndexers: []
}

//
// Reducers

export default function indexersReducer(state = initialState, action: IndexersConfigActionTypes) {
    switch(action.type) {
        case FETCH_INDEXERS_PENDING:
            return {
                ...state,
                isLoaded: false
            }
        case FETCH_INDEXERS_SUCCESS:
            return {
                ...state,
                isLoaded: true,
                configuredIndexers: action.configuredIndexers,
                unConfiguredIndexers: action.unConfiguredIndexers
            }
        case FETCH_INDEXERS_ERROR:
            return {
                ...state,
                isLoaded: true,
                error: action.error
            }
        default:
            return state;
    }
}

//
// Selectors
