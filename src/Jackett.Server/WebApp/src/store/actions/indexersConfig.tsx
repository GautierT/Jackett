import {
    FETCH_INDEXERS_ERROR,
    FETCH_INDEXERS_PENDING,
    FETCH_INDEXERS_SUCCESS,
    IndexersConfig,
    IndexersConfigActionTypes
} from "../types/indexersConfig";

//
// Actions

export function fetchIndexersPending(): IndexersConfigActionTypes {
    return {
        type: FETCH_INDEXERS_PENDING
    }
}

export function fetchIndexersSuccess(indexers: IndexersConfig): IndexersConfigActionTypes {
    return {
        type: FETCH_INDEXERS_SUCCESS,
        indexers: indexers
    }
}

export function fetchIndexersError(error: string): IndexersConfigActionTypes {
    return {
        type: FETCH_INDEXERS_ERROR,
        error: error
    }
}
