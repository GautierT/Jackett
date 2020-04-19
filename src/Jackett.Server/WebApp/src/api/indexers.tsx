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

export enum ConfigFieldType {
    InputString = "inputstring",
    InputBool = "inputbool",
    InputCheckbox = "inputcheckbox",
    InputSelect = "inputselect",
    DisplayImage = "displayimage",
    DisplayInfo = "displayinfo",
    HiddenData = "hiddendata",
    // ReCaptcha is deprecated and should be removed after it's removed from the backend
    // https://github.com/Jackett/Jackett/issues/8268
    ReCaptcha = "recaptcha"
}

export interface IndexerConfigField {
    id: string
    type: ConfigFieldType
    name: string
    value: string
    options: {[key: string]: string}
    values: Array<string> // used only by ConfigFieldType.InputCheckbox
    cookie: string // used only by ConfigFieldType.ReCaptcha
}

export interface IndexerConfigFields extends Array<IndexerConfigField> {}

export function getIndexers()
    : Promise<AxiosResponse<IndexersResponse>> {
    return http.request<IndexersResponse>({
        url: "/api/v2.0/indexers",
        method: "GET"
    });
}

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

export function deleteIndexer(id: string) {
    return http.request({
        url: `/api/v2.0/indexers/${id}`,
        method: "DELETE"
    });
}
