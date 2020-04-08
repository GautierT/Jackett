/*
// Config example

{
  "notices": [
    "Jackett is running with root privileges. You should run Jackett as an unprivileged user."
  ],
  "port": 9117,
  "external": true,
  "api_key": "bszqtu44xg5j5ukfptttfrf57rknv9ud",
  "blackholedir": "",
  "updatedisabled": false,
  "prerelease": false,
  "password": "9cfc7cec3b",
  "logging": false,
  "basepathoverride": "/jackett",
  "omdbkey": "",
  "omdburl": "",
  "app_version": "0.14.476.0",
  "can_run_netcore": false,
  "proxy_type": 0,
  "proxy_url": "",
  "proxy_port": null,
  "proxy_username": "",
  "proxy_password": ""
}
*/

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
