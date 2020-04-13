import axios from 'axios';

// create an axios instance with default options
export const http = axios.create();

export function encodeQueryData(data: Array<Array<string>>) {
    let ret: Array<string> = [];
    data.forEach((d: Array<string>) => {
        ret.push(encodeURIComponent(d[0]) + '=' + encodeURIComponent(d[1]));
    });
    return ret.join('&');
}
