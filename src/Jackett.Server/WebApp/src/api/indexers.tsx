import {AxiosResponse} from "axios";
import {http} from "./index"

// TODO: document the fields
export enum IndexerType {
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

export enum ConfigFieldType {
    InputString = "inputstring",
    InputBool = "inputbool",
    InputCheckbox = "inputcheckbox",
    InputSelect = "inputselect",
    HiddenData = "hiddendata",
    DisplayInfo = "displayinfo",
    DisplayImage = "displayimage",
    ReCaptcha = "recaptcha"
}

export interface IndexerConfigField {
    id: string
    type: ConfigFieldType
    name: string
    value: string
    options: {[key: string]: string}
}

export interface IndexerConfigFields extends Array<IndexerConfigField> {}

export function getIndexerConfig(id: string)
    : Promise<AxiosResponse<IndexerConfigFields>> {
    return http.request<IndexerConfigFields>({
        url: `/api/v2.0/indexers/${id}/config`,
        method: "GET"
    });
}

export function postIndexerConfig(id: string, indexerConfigFields: IndexerConfigFields) {
    return http.request({
        url: `/api/v2.0/indexers/${id}/config`,
        method: "POST",
        data: indexerConfigFields
    });
}
