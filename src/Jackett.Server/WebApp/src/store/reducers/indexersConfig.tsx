import {
    FETCH_INDEXERS_PENDING, FETCH_INDEXERS_SUCCESS, FETCH_INDEXERS_ERROR,
    UPDATE_INDEXER_PENDING, UPDATE_INDEXER_SUCCESS, UPDATE_INDEXER_ERROR,
    DELETE_INDEXER_PENDING, DELETE_INDEXER_SUCCESS, DELETE_INDEXER_ERROR,
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
    let configuredIndexers: Array<IndexerConfig> = [];
    let unConfiguredIndexers: Array<IndexerConfig> = [];

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
        case UPDATE_INDEXER_PENDING:
            return {
                ...state,
                isUpdating: true,
                errorUpdate: ""
            }
        case UPDATE_INDEXER_SUCCESS:
            configuredIndexers = state.configuredIndexers;
            unConfiguredIndexers = state.unConfiguredIndexers;

            // if the indexer is updated we don't do anything
            const findIndexer = state.unConfiguredIndexers
                .filter(indexer => indexer.id === action.id);
            if (findIndexer.length > 0) {
                let indexerConfig = findIndexer[0];
                indexerConfig.configured = true;

                configuredIndexers = configuredIndexers.slice();
                configuredIndexers.push(indexerConfig);

                unConfiguredIndexers = unConfiguredIndexers.filter(indexer => indexer.id !== action.id);
            }

            return {
                ...state,
                isUpdating: false,
                errorUpdate: "",
                configuredIndexers: configuredIndexers,
                unConfiguredIndexers: unConfiguredIndexers
            }
        case UPDATE_INDEXER_ERROR:
            return {
                ...state,
                isUpdating: false,
                errorUpdate: action.errorUpdate
            }
        case DELETE_INDEXER_PENDING:
            return {
                ...state,
                isUpdating: true,
                errorUpdate: ""
            }
        case DELETE_INDEXER_SUCCESS:
            configuredIndexers = state.configuredIndexers;
            unConfiguredIndexers = state.unConfiguredIndexers;

            // TODO: fix
            // if the indexer is updated we don't do anything
            const findIndexer2 = state.configuredIndexers
                .filter(indexer => indexer.id === action.id);
            if (findIndexer2.length > 0) {
                let indexerConfig = findIndexer2[0];
                indexerConfig.configured = false;

                unConfiguredIndexers = unConfiguredIndexers.slice();
                unConfiguredIndexers.push(indexerConfig);

                configuredIndexers = configuredIndexers.filter(indexer => indexer.id !== action.id);
            }

            return {
                ...state,
                isUpdating: false,
                errorUpdate: "",
                configuredIndexers: configuredIndexers,
                unConfiguredIndexers: unConfiguredIndexers
            }
        case DELETE_INDEXER_ERROR:
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
