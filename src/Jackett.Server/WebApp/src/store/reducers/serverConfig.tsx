import {
    ServerConfigActionTypes, ServerConfigState,
    FETCH_CONFIG_ERROR, FETCH_CONFIG_PENDING, FETCH_CONFIG_SUCCESS,
    UPDATE_CONFIG_PENDING, UPDATE_CONFIG_SUCCESS, UPDATE_CONFIG_ERROR
} from "../types/serverConfig";
import {ServerConfig} from "../../api/configuration";

//
// Initial state

const initialState: ServerConfigState = {
    isLoaded: false,
    isUpdating: false,
    error: "",
    errorUpdate: "",
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
        case UPDATE_CONFIG_PENDING:
            return {
                ...state,
                isUpdating: true,
                errorUpdate: "",
            }
        case UPDATE_CONFIG_SUCCESS:
            return {
                ...state,
                isUpdating: false,
                errorUpdate: "",
                config: {...state.config, ...action.updateConfig}
            }
        case UPDATE_CONFIG_ERROR:
            return {
                ...state,
                isUpdating: false,
                errorUpdate: action.errorUpdate
            }
        default:
            return state;
    }
}

//
// Selectors
