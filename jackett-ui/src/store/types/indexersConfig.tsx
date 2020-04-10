
//
// Interfaces

enum IndexerType {
    Public = "public",
    SemiPrivate = "semi-private",
    Private = "private"
}

export interface IndexerCaps {
    ID: string
    Name: string
}

export interface IndexerConfig {
    alternativesitelinks: Array<string>
    caps: Array<IndexerCaps>
    configured: boolean
    description: string
    id: string
    language: string
    last_error: string
    name: string
    potatoenabled: boolean
    site_link: string
    type: IndexerType
}

export interface IndexersConfig extends Array<IndexerConfig> {}

export interface IndexersConfigState {
    isLoaded: boolean
    error: string
    indexers: IndexersConfig
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
    indexers: IndexersConfig
}

interface FetchIndexersErrorAction {
    type: typeof FETCH_INDEXERS_ERROR
    error: string
}

export type IndexersConfigActionTypes = FetchIndexersPendingAction | FetchIndexersSuccessAction | FetchIndexersErrorAction
