export const FETCH_CONFIG_PENDING = 'FETCH_CONFIG_PENDING';
export const FETCH_CONFIG_SUCCESS = 'FETCH_CONFIG_SUCCESS';
export const FETCH_CONFIG_ERROR = 'FETCH_CONFIG_ERROR';

export function fetchConfigPending() {
    return {
        type: FETCH_CONFIG_PENDING
    }
}

export function fetchConfigSuccess(config) {
    return {
        type: FETCH_CONFIG_SUCCESS,
        config: config
    }
}

export function fetchConfigError(error) {
    return {
        type: FETCH_CONFIG_ERROR,
        error: error
    }
}

function fetchConfig() {
  return dispatch => {
      dispatch(fetchConfigPending());
      fetch('/api/v2.0/server/config')
      .then(res => res.json())
      .then(res => {
          dispatch(fetchConfigSuccess(res));
          return res;
      })
      .catch(error => {
          dispatch(fetchConfigError("Error fetching config API!"));
      })
  }
}

export default fetchConfig;
