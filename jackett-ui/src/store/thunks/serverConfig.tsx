import {Dispatch} from "redux";
import {
    fetchConfigError,
    fetchConfigPending,
    fetchConfigSuccess, updateConfigError,
    updateConfigPending,
    updateConfigSuccess
} from "../actions/serverConfig";
import {ServerConfig} from "../types/serverConfig";

//
// Thunks

export function fetchServerConfig() {
    return (dispatch: Dispatch) => {
        dispatch(fetchConfigPending());
        fetch('/api/v2.0/server/config')
            .then(res => res.json())
            .then(res => {
                dispatch(fetchConfigSuccess(res));
            })
            .catch(error => {
                dispatch(fetchConfigError("Error fetching config API!"));
            })
    }
}

export function updateServerConfig(data: ServerConfig) {
    return (dispatch: Dispatch) => {
        dispatch(updateConfigPending());
        fetch('/api/v2.0/server/config', {
            method: 'POST',
            body: JSON.stringify(data),
            headers:{
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(res => {
                // TODO: the response format is different
                dispatch(updateConfigSuccess(data));
            })
            .catch(error => {
                dispatch(updateConfigError("Error updating config!"));
            })
    }
}

