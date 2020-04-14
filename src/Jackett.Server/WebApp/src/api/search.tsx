import {http, encodeQueryData} from "./index"
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
    let qc: Array<Array<string>> = [];
    qc.push(["apikey", apikey]);
    qc.push(["Query", query ? query : ""]);
    if (indexers) {
        indexers.forEach((indexer: string) => {
            qc.push(["Tracker[]", indexer]);
        })
    }

    return http.request<SearchResponse>({
        url: "/api/v2.0/indexers/all/results?" + encodeQueryData(qc),
        method: "GET"
    });
}
