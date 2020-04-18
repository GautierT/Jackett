import {AxiosResponse} from "axios";
import {http} from "./index"

// TODO: document the fields
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

export interface UpdateServerConfig {
    basepathoverride: string
    blackholedir: string
    external: boolean
    logging: boolean
    omdbkey: string
    omdburl: string
    port: number
    prerelease: boolean
    proxy_password: string
    proxy_port: number
    proxy_type: number
    proxy_url: string
    proxy_username: string
    updatedisabled: boolean
}

export function getServerConfig(): Promise<AxiosResponse<ServerConfig>> {
    return http.request<ServerConfig>({
        url: "/api/v2.0/server/config",
        method: "GET"
    });
}

export function postServerConfig(updateConfig: UpdateServerConfig): Promise<AxiosResponse<void>> {
    // TODO: the response format is different, this should be changed in the backend
    return http.request<void>({
        url: "/api/v2.0/server/config",
        method: "POST",
        data: updateConfig
    });
}
