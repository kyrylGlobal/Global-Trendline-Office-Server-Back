import axios, { AxiosRequestConfig } from "axios";

class HttpRequest {
    async get(url: string) {
        throw new Error("Not implemented function");
    }

    async post(url: string, data: any, config: AxiosRequestConfig) {
        axios.post(url, data, config)
        .then((data:any) => {
            return data;
        })
        .catch( error => {
            return error;
        })
    }
}

export default new HttpRequest();