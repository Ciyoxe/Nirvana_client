import { ResponseHandler, sendFormdata, sendRequest } from "./sendRequest";

type ErrRes = {
    error: string,
}
type UploadRes = {
    url: string
}

export async function uploadFile(file: File, handler: ResponseHandler<UploadRes, ErrRes>) {
    const data = new FormData();
    data.append("file", file);

    await sendFormdata("post", "/api/file", data, handler);
}
export async function getFile(url: string, handler: ResponseHandler<any, ErrRes>) {
    await sendRequest("get", url, {}, handler);
}