import {
    ServerConfigActionTypes,
    FETCH_CONFIG_ERROR,
    FETCH_CONFIG_PENDING,
    FETCH_CONFIG_SUCCESS,
    ServerConfig, UPDATE_CONFIG_PENDING, UPDATE_CONFIG_SUCCESS, UPDATE_CONFIG_ERROR
} from "../types/serverConfig";

//
// Actions

export function fetchConfigPending(): ServerConfigActionTypes {
    return {
        type: FETCH_CONFIG_PENDING
    }
}

export function fetchConfigSuccess(config: ServerConfig): ServerConfigActionTypes {
    return {
        type: FETCH_CONFIG_SUCCESS,
        config: config
    }
}

export function fetchConfigError(error: string): ServerConfigActionTypes {
    return {
        type: FETCH_CONFIG_ERROR,
        error: error
    }
}

export function updateConfigPending(): ServerConfigActionTypes {
    return {
        type: UPDATE_CONFIG_PENDING
    }
}

export function updateConfigSuccess(config: ServerConfig): ServerConfigActionTypes {
    return {
        type: UPDATE_CONFIG_SUCCESS,
        config: config
    }
}

export function updateConfigError(error: string): ServerConfigActionTypes {
    return {
        type: UPDATE_CONFIG_ERROR,
        error: error
    }
}
