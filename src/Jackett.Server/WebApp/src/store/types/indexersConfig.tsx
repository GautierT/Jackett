
//
// Interfaces

import {IndexerConfig} from "../../api/indexers";

export interface IndexersConfigState {
    isLoaded: boolean
    isUpdating: boolean
    error: string
    errorUpdate: string
    configuredIndexers: Array<IndexerConfig>
    unConfiguredIndexers: Array<IndexerConfig>
}

//
// Actions Types

export const FETCH_INDEXERS_PENDING = 'FETCH_INDEXERS_PENDING';
export const FETCH_INDEXERS_SUCCESS = 'FETCH_INDEXERS_SUCCESS';
export const FETCH_INDEXERS_ERROR = 'FETCH_INDEXERS_ERROR';

export const ADD_INDEXER_PENDING = 'ADD_INDEXER_PENDING';
export const ADD_INDEXER_SUCCESS = 'ADD_INDEXER_SUCCESS';
export const ADD_INDEXER_ERROR = 'ADD_INDEXER_ERROR';

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

interface AddIndexerPendingAction {
    type: typeof ADD_INDEXER_PENDING
}

interface AddIndexerSuccessAction {
    type: typeof ADD_INDEXER_SUCCESS
    id: string
}

interface AddIndexerErrorAction {
    type: typeof ADD_INDEXER_ERROR
    errorUpdate: string
}

export type IndexersConfigActionTypes = FetchIndexersPendingAction | FetchIndexersSuccessAction | FetchIndexersErrorAction |
    AddIndexerPendingAction | AddIndexerSuccessAction | AddIndexerErrorAction
