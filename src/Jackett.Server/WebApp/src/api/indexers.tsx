import {AxiosResponse} from "axios";
import {http} from "./index"

// TODO: document the fields
enum IndexerType {
    Public = "public",
    SemiPrivate = "semi-private",
    Private = "private"
}

export interface IndexerCaps {
    ID: string
    Name: string
}

export interface IndexerConfig {
    alternativesitelinks: Array<string>
    caps: Array<IndexerCaps>
    configured: boolean
    description: string
    id: string
    language: string
    last_error: string
    name: string
    potatoenabled: boolean
    site_link: string
    type: IndexerType
}

export interface IndexersResponse extends Array<IndexerConfig> {}

export function getIndexers()
    : Promise<AxiosResponse<IndexersResponse>> {
    return http.request<IndexersResponse>({
        url: "/api/v2.0/indexers",
        method: "GET"
    });
}
