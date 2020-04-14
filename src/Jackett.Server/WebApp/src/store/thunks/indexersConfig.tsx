import {Dispatch} from "redux";
import {fetchIndexersError, fetchIndexersPending, fetchIndexersSuccess} from "../actions/indexersConfig";
import {getIndexers, IndexerConfig} from "../../api/indexers";

//
// Thunks

export function fetchIndexersConfig() {
    return (dispatch: Dispatch) => {
        dispatch(fetchIndexersPending());

        getIndexers()
            .then(response => {
                let configuredIndexers: Array<IndexerConfig> = [];
                let unConfiguredIndexers: Array<IndexerConfig> = [];
                response.data.forEach(indexer => {
                    if (indexer.configured) {
                        configuredIndexers.push(indexer);
                    } else {
                        unConfiguredIndexers.push(indexer);
                    }
                });
                dispatch(fetchIndexersSuccess(configuredIndexers, unConfiguredIndexers));
            })
            .catch(error => {
                // TODO: show the error
                console.log(error);
                dispatch(fetchIndexersError("Error fetching indexers API!"));
            });
    }
}
