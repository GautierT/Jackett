
//
// Interfaces

export interface ServerConfig {
  api_key: string
  app_version: string
  basepathoverride: string
  blackholedir: string
  can_run_netcore: boolean
  external: boolean
  logging: boolean
  notices: Array<string>
  omdbkey: string
  omdburl: string
  password: string
  port: number
  prerelease: boolean
  proxy_password: string
  proxy_port: number
  proxy_type: number
  proxy_url: string
  proxy_username: string
  updatedisabled: boolean
}

export interface ServerConfigState {
    isLoaded: boolean
    error: string
    config: ServerConfig
}

//
// Actions Types

export const FETCH_CONFIG_PENDING = 'FETCH_CONFIG_PENDING';
export const FETCH_CONFIG_SUCCESS = 'FETCH_CONFIG_SUCCESS';
export const FETCH_CONFIG_ERROR = 'FETCH_CONFIG_ERROR';

interface FetchConfigPendingAction {
    type: typeof FETCH_CONFIG_PENDING
}

interface FetchConfigSuccessAction {
    type: typeof FETCH_CONFIG_SUCCESS
    config: ServerConfig
}

interface FetchConfigErrorAction {
    type: typeof FETCH_CONFIG_ERROR
    error: string
}

export type ServerConfigActionTypes = FetchConfigPendingAction | FetchConfigSuccessAction | FetchConfigErrorAction
