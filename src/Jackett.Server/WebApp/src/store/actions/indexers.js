export const FETCH_INDEXERS_PENDING = 'FETCH_INDEXERS_PENDING';
export const FETCH_INDEXERS_SUCCESS = 'FETCH_INDEXERS_SUCCESS';
export const FETCH_INDEXERS_ERROR = 'FETCH_INDEXERS_ERROR';

export function fetchIndexersPending() {
    return {
        type: FETCH_INDEXERS_PENDING
    }
}

export function fetchIndexersSuccess(indexers) {
    return {
        type: FETCH_INDEXERS_SUCCESS,
        indexers: indexers
    }
}

export function fetchIndexersError(error) {
    return {
        type: FETCH_INDEXERS_ERROR,
        error: error
    }
}

function fetchIndexers() {
  return dispatch => {
      dispatch(fetchIndexersPending());
      fetch('/api/v2.0/indexers')
      .then(res => res.json())
      .then(res => {
          dispatch(fetchIndexersSuccess(res));
          return res;
      })
      .catch(error => {
          dispatch(fetchIndexersError("Error fetching indexers API!"));
      })
  }
}

export default fetchIndexers;
