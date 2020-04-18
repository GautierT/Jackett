import {Dispatch} from "redux";
import {
    fetchConfigError,
    fetchConfigPending,
    fetchConfigSuccess,
    updateConfigError,
    updateConfigPending,
    updateConfigSuccess,
    updateAdminPasswordError,
    updateAdminPasswordPending,
    updateAdminPasswordSuccess
} from "../actions/serverConfig";
import {getServerConfig, postAdminPassword, postServerConfig, UpdateServerConfig} from "../../api/configuration";

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

export function updateAdminPassword(adminPassword: string) {
    return (dispatch: Dispatch) => {
        dispatch(updateAdminPasswordPending());

        // save a fake password in memory for security
        const fakePassword = adminPassword ? "fake_pass" : "";

        postAdminPassword(adminPassword)
            .then(() => {
                dispatch(updateAdminPasswordSuccess(fakePassword));
            })
            .catch(error => {
                const errorUpdate = error.response.data.error || error.message;
                dispatch(updateAdminPasswordError(errorUpdate));
            });
    }
}
