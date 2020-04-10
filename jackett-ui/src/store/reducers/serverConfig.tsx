import {
    ServerConfigActionTypes,
    ServerConfigState,
    FETCH_CONFIG_ERROR,
    FETCH_CONFIG_PENDING,
    FETCH_CONFIG_SUCCESS, ServerConfig
} from "../types/serverConfig";

//
// Initial state

const initialState: ServerConfigState = {
    isLoaded: false,
    error: "",
    config: {} as ServerConfig
}

//
// Reducers

export default function configReducer(state = initialState, action: ServerConfigActionTypes) {
    switch(action.type) {
        case FETCH_CONFIG_PENDING:
            return {
                ...state,
                isLoaded: false
            }
        case FETCH_CONFIG_SUCCESS:
            return {
                ...state,
                isLoaded: true,
                config: action.config
            }
        case FETCH_CONFIG_ERROR:
            return {
                ...state,
                isLoaded: true,
                error: action.error
            }
        default:
            return state;
    }
}

//
// Selectors

export const getServerConfigIsLoaded = (state: ServerConfigState) => state.isLoaded;
export const getServerConfigError = (state: ServerConfigState) => state.error;
export const getServerConfig = (state: ServerConfigState) => state.config;
