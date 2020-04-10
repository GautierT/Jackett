import {Dispatch} from "redux";
import {fetchIndexersError, fetchIndexersPending, fetchIndexersSuccess} from "../actions/indexersConfig";

//
// Thunks

function fetchIndexersConfig() {
    return (dispatch: Dispatch) => {
        dispatch(fetchIndexersPending());
        fetch('/api/v2.0/indexers')
            .then(res => res.json())
            .then(res => {
                dispatch(fetchIndexersSuccess(res));
            })
            .catch(error => {
                dispatch(fetchIndexersError("Error fetching indexers API!"));
            })
    }
}

export default fetchIndexersConfig;
