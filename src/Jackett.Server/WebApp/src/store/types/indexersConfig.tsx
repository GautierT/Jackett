
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

export const UPDATE_INDEXER_PENDING = 'UPDATE_INDEXER_PENDING';
export const UPDATE_INDEXER_SUCCESS = 'UPDATE_INDEXER_SUCCESS';
export const UPDATE_INDEXER_ERROR = 'UPDATE_INDEXER_ERROR';

export const DELETE_INDEXER_PENDING = 'DELETE_INDEXER_PENDING';
export const DELETE_INDEXER_SUCCESS = 'DELETE_INDEXER_SUCCESS';
export const DELETE_INDEXER_ERROR = 'DELETE_INDEXER_ERROR';

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

interface UpdateIndexerPendingAction {
    type: typeof UPDATE_INDEXER_PENDING
}

interface UpdateIndexerSuccessAction {
    type: typeof UPDATE_INDEXER_SUCCESS
    id: string
}

interface UpdateIndexerErrorAction {
    type: typeof UPDATE_INDEXER_ERROR
    errorUpdate: string
}

interface DeleteIndexerPendingAction {
    type: typeof DELETE_INDEXER_PENDING
}

interface DeleteIndexerSuccessAction {
    type: typeof DELETE_INDEXER_SUCCESS
    id: string
}

interface DeleteIndexerErrorAction {
    type: typeof DELETE_INDEXER_ERROR
    errorUpdate: string
}

export type IndexersConfigActionTypes = FetchIndexersPendingAction | FetchIndexersSuccessAction | FetchIndexersErrorAction |
    UpdateIndexerPendingAction | UpdateIndexerSuccessAction | UpdateIndexerErrorAction |
    DeleteIndexerPendingAction | DeleteIndexerSuccessAction | DeleteIndexerErrorAction
