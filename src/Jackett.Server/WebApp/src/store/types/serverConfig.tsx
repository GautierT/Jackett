import {ServerConfig, UpdateServerConfig} from "../../api/configuration";

//
// Interfaces

export interface ServerConfigState {
    isLoaded: boolean
    isUpdating: boolean
    error: string
    errorUpdate: string
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
export const UPDATE_ADMIN_PASSWORD_PENDING = 'UPDATE_ADMIN_PASSWORD_PENDING';
export const UPDATE_ADMIN_PASSWORD_SUCCESS = 'UPDATE_ADMIN_PASSWORD_SUCCESS';
export const UPDATE_ADMIN_PASSWORD_ERROR = 'UPDATE_ADMIN_PASSWORD_ERROR';

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
    updateConfig: UpdateServerConfig
}

interface UpdateConfigErrorAction {
    type: typeof UPDATE_CONFIG_ERROR
    errorUpdate: string
}

interface UpdateAdminPasswordPendingAction {
    type: typeof UPDATE_ADMIN_PASSWORD_PENDING
}

interface UpdateAdminPasswordSuccessAction {
    type: typeof UPDATE_ADMIN_PASSWORD_SUCCESS
    adminPassword: string
}

interface UpdateAdminPasswordErrorAction {
    type: typeof UPDATE_ADMIN_PASSWORD_ERROR
    errorUpdate: string
}

export type ServerConfigActionTypes = FetchConfigPendingAction | FetchConfigSuccessAction | FetchConfigErrorAction |
    UpdateConfigPendingAction | UpdateConfigSuccessAction | UpdateConfigErrorAction |
    UpdateAdminPasswordPendingAction | UpdateAdminPasswordSuccessAction | UpdateAdminPasswordErrorAction
