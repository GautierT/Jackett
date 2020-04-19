import {Dispatch} from "redux";
import {
    fetchIndexersPending, fetchIndexersSuccess,fetchIndexersError,
    addIndexerPending, addIndexerSuccess, addIndexerError
} from "../actions/indexersConfig";
import {getIndexers, postIndexerConfig, IndexerConfig, IndexerConfigFields} from "../../api/indexers";

//
// Thunks

export function fetchIndexersConfig() {
    return (dispatch: Dispatch) => {
        dispatch(fetchIndexersPending());

        getIndexers()
            .then(response => {
                // TODO: index by id
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

export function addIndexerConfig(id: string, indexerConfigFields: IndexerConfigFields) {
    return (dispatch: Dispatch) => {
        dispatch(addIndexerPending());

        postIndexerConfig(id, indexerConfigFields)
            .then(response => {
                dispatch(addIndexerSuccess(id));
            })
            .catch(error => {
                const errorUpdate = error.response.data.error || error.message;
                dispatch(addIndexerError(errorUpdate));
            });
    }
}
