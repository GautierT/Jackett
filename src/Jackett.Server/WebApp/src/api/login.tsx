import qs from "qs";
import {http} from "./index"

export function checkLogin() {
    return http.request({
        url: "/api/v2.0/server/config",
        method: "GET"
    });
}

export function doLogin(password: string) {
    return http.request({
        url: "/UI/Dashboard",
        method: "POST",
        data: qs.stringify({password: password}),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}

export function configureLoginInterceptor() {
    // this global interceptor will reload the page if the session expires
    // so we can login again
    http.interceptors.response.use((response) =>
        {
            const responseURL = response.request.responseURL;
            if (responseURL != null && responseURL.includes("/UI/Login")) {
                // TODO: we can do better than this
                window.location.reload();
            }
            return response;
        });
}
