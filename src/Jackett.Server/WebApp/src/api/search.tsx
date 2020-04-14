import qs from "qs"
import {http} from "./index"
import {AxiosResponse} from "axios";

// TODO: document the fields
export interface SearchResult {
    BannerUrl: string
    BlackholeLink: string
    Category: Array<number>
    CategoryDesc: string
    Comments: string
    Description: string
    DownloadVolumeFactor: number
    Files: number
    FirstSeen: string
    Gain: number
    Grabs: number
    Guid: string
    Imdb: number
    InfoHash: string
    Link: string
    MagnetUri: string
    MinimumRatio: number
    MinimumSeedTime: number
    Peers: number
    PublishDate: string
    RageID: number
    Seeders: number
    Size: number
    Title: string
    TMDb: number
    Tracker: string
    TrackerId: string
    TVDBId: number
    UploadVolumeFactor: number
}

export interface SearchIndexer {
    ID: string
    Name: string
    Status: number
    Results: number
    Error: string
}

export interface SearchResponse {
    Results: Array<SearchResult>
    Indexers: Array<SearchIndexer>
}

export function getSearchResults(apikey: string, query?: string, indexers?: Array<string>): Promise<AxiosResponse<SearchResponse>> {
    const queryParams = qs.stringify({
        "apikey": apikey,
        "Query": query || "",
        "Tracker": indexers
    }, { arrayFormat: 'brackets' });

    return http.request<SearchResponse>({
        url: "/api/v2.0/indexers/all/results?" + queryParams,
        method: "GET"
    });
}
