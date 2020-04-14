import {Dispatch} from "redux";
import {
    fetchConfigError, fetchConfigPending, fetchConfigSuccess,
    updateConfigError, updateConfigPending, updateConfigSuccess
} from "../actions/serverConfig";
import {getServerConfig, postServerConfig, ServerConfig} from "../../api/configuration";

//
// Thunks

export function fetchServerConfig() {
    return (dispatch: Dispatch) => {
        dispatch(fetchConfigPending());

        getServerConfig()
            .then(response => {
                dispatch(fetchConfigSuccess(response.data));
            })
            .catch(error => {
                // TODO: show the error
                console.log(error);
                dispatch(fetchConfigError("Error fetching config API!"));
            });
    }
}

export function updateServerConfig(data: ServerConfig) {
    return (dispatch: Dispatch) => {
        dispatch(updateConfigPending());

        postServerConfig(data)
            .then(() => {
                // TODO: the response format is different, this should be changed in the back
                dispatch(updateConfigSuccess(data));
            })
            .catch(error => {
                // TODO: show the error
                console.log(error);
                dispatch(updateConfigError("Error updating config!"));
            });
    }
}

