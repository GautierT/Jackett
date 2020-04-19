import {Dispatch} from "redux";
import {
    fetchIndexersPending, fetchIndexersSuccess,fetchIndexersError,
    updateIndexerPending, updateIndexerSuccess, updateIndexerError,
    deleteIndexerPending, deleteIndexerSuccess, deleteIndexerError
} from "../actions/indexersConfig";
import {
    getIndexers, postIndexerConfig, deleteIndexer,
    IndexerConfig, IndexerConfigFields
} from "../../api/indexers";

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

export function updateIndexerConfig(id: string, indexerConfigFields: IndexerConfigFields) {
    return (dispatch: Dispatch) => {
        dispatch(updateIndexerPending());

        postIndexerConfig(id, indexerConfigFields)
            .then(() => {
                dispatch(updateIndexerSuccess(id));
            })
            .catch(error => {
                const errorUpdate = error.response.data.error || error.message;
                dispatch(updateIndexerError(errorUpdate));
            });
    }
}

export function deleteIndexerConfig(id: string) {
    return (dispatch: Dispatch) => {
        dispatch(deleteIndexerPending());

        deleteIndexer(id)
            .then(() => {
                dispatch(deleteIndexerSuccess(id));
            })
            .catch(error => {
                const errorUpdate = error.response.data.error || error.message;
                dispatch(deleteIndexerError(errorUpdate));
            });
    }
}
