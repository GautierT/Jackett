import {
    FETCH_INDEXERS_PENDING, FETCH_INDEXERS_SUCCESS, FETCH_INDEXERS_ERROR,
    UPDATE_INDEXER_PENDING, UPDATE_INDEXER_SUCCESS, UPDATE_INDEXER_ERROR,
    DELETE_INDEXER_PENDING, DELETE_INDEXER_SUCCESS, DELETE_INDEXER_ERROR,
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

export function fetchIndexersSuccess(configuredIndexers: Array<IndexerConfig>,
                                     unConfiguredIndexers: Array<IndexerConfig>) : IndexersConfigActionTypes {
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

export function updateIndexerPending(): IndexersConfigActionTypes {
    return {
        type: UPDATE_INDEXER_PENDING
    }
}

export function updateIndexerSuccess(id: string) : IndexersConfigActionTypes {
    return {
        type: UPDATE_INDEXER_SUCCESS,
        id: id
    }
}

export function updateIndexerError(errorUpdate: string): IndexersConfigActionTypes {
    return {
        type: UPDATE_INDEXER_ERROR,
        errorUpdate: errorUpdate
    }
}

export function deleteIndexerPending(): IndexersConfigActionTypes {
    return {
        type: DELETE_INDEXER_PENDING
    }
}

export function deleteIndexerSuccess(id: string) : IndexersConfigActionTypes {
    return {
        type: DELETE_INDEXER_SUCCESS,
        id: id
    }
}

export function deleteIndexerError(errorUpdate: string): IndexersConfigActionTypes {
    return {
        type: DELETE_INDEXER_ERROR,
        errorUpdate: errorUpdate
    }
}
