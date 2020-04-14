import {ServerConfig} from "../../api/configuration";

//
// Interfaces

export interface ServerConfigState {
    isLoaded: boolean
    isUpdating: boolean
    error: string
    config: ServerConfig
}

//
// Actions Types

export const FETCH_CONFIG_PENDING = 'FETCH_CONFIG_PENDING';
export const FETCH_CONFIG_SUCCESS = 'FETCH_CONFIG_SUCCESS';
export const FETCH_CONFIG_ERROR = 'FETCH_CONFIG_ERROR';
export const UPDATE_CONFIG_PENDING = 'UPDATE_CONFIG_PENDING';
export const UPDATE_CONFIG_SUCCESS = 'UPDATE_CONFIG_SUCCESS';
export const UPDATE_CONFIG_ERROR = 'UPDATE_CONFIG_ERROR';

interface FetchConfigPendingAction {
    type: typeof FETCH_CONFIG_PENDING
}

interface FetchConfigSuccessAction {
    type: typeof FETCH_CONFIG_SUCCESS
    config: ServerConfig
}

interface FetchConfigErrorAction {
    type: typeof FETCH_CONFIG_ERROR
    error: string
}

interface UpdateConfigPendingAction {
    type: typeof UPDATE_CONFIG_PENDING
}

interface UpdateConfigSuccessAction {
    type: typeof UPDATE_CONFIG_SUCCESS
    config: ServerConfig
}

interface UpdateConfigErrorAction {
    type: typeof UPDATE_CONFIG_ERROR
    error: string
}

export type ServerConfigActionTypes = FetchConfigPendingAction | FetchConfigSuccessAction | FetchConfigErrorAction |
    UpdateConfigPendingAction | UpdateConfigSuccessAction | UpdateConfigErrorAction
