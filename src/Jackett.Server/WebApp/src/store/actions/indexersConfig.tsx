import {
    FETCH_INDEXERS_PENDING, FETCH_INDEXERS_SUCCESS, FETCH_INDEXERS_ERROR,
    ADD_INDEXER_PENDING, ADD_INDEXER_SUCCESS, ADD_INDEXER_ERROR,
    IndexersConfigActionTypes
} from "../types/indexersConfig";
import {IndexerConfig} from "../../api/indexers";

//
// Actions

export function fetchIndexersPending(): IndexersConfigActionTypes {
    return {
        type: FETCH_INDEXERS_PENDING
    }
}

export function fetchIndexersSuccess(configuredIndexers: Array<IndexerConfig>, unConfiguredIndexers: Array<IndexerConfig>)
    : IndexersConfigActionTypes {
    return {
        type: FETCH_INDEXERS_SUCCESS,
        configuredIndexers: configuredIndexers,
        unConfiguredIndexers: unConfiguredIndexers
    }
}

export function fetchIndexersError(error: string): IndexersConfigActionTypes {
    return {
        type: FETCH_INDEXERS_ERROR,
        error: error
    }
}

export function addIndexerPending(): IndexersConfigActionTypes {
    return {
        type: ADD_INDEXER_PENDING
    }
}

export function addIndexerSuccess(id: string)
    : IndexersConfigActionTypes {
    return {
        type: ADD_INDEXER_SUCCESS,
        id: id
    }
}

export function addIndexerError(errorUpdate: string): IndexersConfigActionTypes {
    return {
        type: ADD_INDEXER_ERROR,
        errorUpdate: errorUpdate
    }
}
