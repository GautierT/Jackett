import {
    FETCH_INDEXERS_ERROR,
    FETCH_INDEXERS_PENDING,
    FETCH_INDEXERS_SUCCESS,
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
