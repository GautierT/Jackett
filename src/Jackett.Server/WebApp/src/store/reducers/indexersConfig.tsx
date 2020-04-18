import {
    FETCH_INDEXERS_PENDING, FETCH_INDEXERS_SUCCESS, FETCH_INDEXERS_ERROR,
    ADD_INDEXER_PENDING, ADD_INDEXER_SUCCESS, ADD_INDEXER_ERROR,
    IndexersConfigState, IndexersConfigActionTypes
} from "../types/indexersConfig";
import {IndexerConfig} from "../../api/indexers";

//
// Initial state

const initialState: IndexersConfigState = {
    isLoaded: false,
    isUpdating: false,
    error: "",
    errorUpdate: "",
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
        case ADD_INDEXER_PENDING:
            return {
                ...state,
                isUpdating: true,
                errorUpdate: ""
            }
        case ADD_INDEXER_SUCCESS:
            let indexerConfig = state.unConfiguredIndexers
                .filter(indexer => indexer.id === action.id)[0];
            indexerConfig.configured = true;

            let configuredIndexers: Array<IndexerConfig> = state.configuredIndexers.slice();
            configuredIndexers.push(indexerConfig);

            let unConfiguredIndexers: Array<IndexerConfig> = state.unConfiguredIndexers
                .filter(indexer => indexer.id !== action.id);

            return {
                ...state,
                isUpdating: false,
                errorUpdate: "",
                configuredIndexers: configuredIndexers,
                unConfiguredIndexers: unConfiguredIndexers
            }
        case ADD_INDEXER_ERROR:
            return {
                ...state,
                isUpdating: false,
                errorUpdate: action.errorUpdate
            }
        default:
            return state;
    }
}

//
// Selectors
