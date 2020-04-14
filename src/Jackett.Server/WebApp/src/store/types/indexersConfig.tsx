
//
// Interfaces

import {IndexerConfig} from "../../api/indexers";

export interface IndexersConfigState {
    isLoaded: boolean
    error: string
    configuredIndexers: Array<IndexerConfig>
    unConfiguredIndexers: Array<IndexerConfig>
}

//
// Actions Types

export const FETCH_INDEXERS_PENDING = 'FETCH_INDEXERS_PENDING';
export const FETCH_INDEXERS_SUCCESS = 'FETCH_INDEXERS_SUCCESS';
export const FETCH_INDEXERS_ERROR = 'FETCH_INDEXERS_ERROR';

interface FetchIndexersPendingAction {
    type: typeof FETCH_INDEXERS_PENDING
}

interface FetchIndexersSuccessAction {
    type: typeof FETCH_INDEXERS_SUCCESS
    configuredIndexers: Array<IndexerConfig>
    unConfiguredIndexers: Array<IndexerConfig>
}

interface FetchIndexersErrorAction {
    type: typeof FETCH_INDEXERS_ERROR
    error: string
}

export type IndexersConfigActionTypes = FetchIndexersPendingAction | FetchIndexersSuccessAction | FetchIndexersErrorAction
