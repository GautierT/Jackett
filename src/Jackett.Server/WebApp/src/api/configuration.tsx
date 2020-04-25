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
    password: string // this is not the real password
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

export interface LogTrace {
    Level: string
    Message: string
    When: string
}

export interface LogsResponse extends Array<LogTrace>{}

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

export function postAdminPassword(adminPassword: string): Promise<AxiosResponse<void>> {
    return http.request<void>({
        url: "/api/v2.0/server/adminpassword",
        method: "POST",
        data: `"${adminPassword}"`,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

export function postUpdate(): Promise<AxiosResponse<void>> {
    return http.request<void>({
        url: "/api/v2.0/server/update",
        method: "POST"
    });
}

export function getLogs(): Promise<AxiosResponse<LogsResponse>> {
    return http.request<LogsResponse>({
        url: "/api/v2.0/server/logs",
        method: "GET"
    });
}
