import {Dispatch} from "redux";
import {fetchConfigError, fetchConfigPending, fetchConfigSuccess} from "../actions/serverConfig";

//
// Thunks

function fetchServerConfig() {
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

export default fetchServerConfig;
