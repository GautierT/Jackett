import {Dispatch} from "redux";
import {
    fetchConfigError, fetchConfigPending, fetchConfigSuccess,
    updateConfigError, updateConfigPending, updateConfigSuccess
} from "../actions/serverConfig";
import {getServerConfig, postServerConfig, UpdateServerConfig} from "../../api/configuration";

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

export function updateServerConfig(updateConfig: UpdateServerConfig) {
    return (dispatch: Dispatch) => {
        dispatch(updateConfigPending());

        postServerConfig(updateConfig)
            .then(() => {
                // TODO: the response format is different from the request, this should be changed in the back
                dispatch(updateConfigSuccess(updateConfig));
            })
            .catch(error => {
                const errorUpdate = error.response.data.error || error.message;
                dispatch(updateConfigError(errorUpdate));
            });
    }
}

