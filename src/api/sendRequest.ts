import { Signal } from "./signal";

export type ResponseHandler<TOk, TErr> =  {
    200?: (json: TOk) => void,
    _?  : (status: number, err: TErr | null)=> void, 
};

export const onResponse = new Signal<{ status: number, data: any }>();

async function processReq<T, U>(
    hanlder: ResponseHandler<T, U>,
    res: Response,
    mapper?: (data: any)=> T,
) {
    let jsonData = null;
    try {
        jsonData = await res.json();
    } catch { }


    switch (res.status) {
        case 200:
            jsonData = mapper ? mapper(jsonData) : jsonData;
            onResponse.emit({ status: 200, data: jsonData });
            hanlder[200]?.(jsonData);
            break;
        default:
            onResponse.emit({ status: res.status, data: jsonData });
            hanlder._?.(res.status, jsonData);
    }
}


export async function sendRequest<TOk, TErr>(
    method  : string, 
    url     : string, 
    data    : object, 
    handler : ResponseHandler<TOk, TErr>, 
    mapper? : (data: any)=> TOk,
) {
    const res = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json"
        },
        body: method === "get" ? undefined : JSON.stringify(data)
    });
    processReq(handler, res, mapper);
}
export async function sendFormdata<TOk, TErr>(
    method  : string, 
    url     : string, 
    data    : FormData, 
    handler : ResponseHandler<TOk, TErr>,
    mapper? : (data: any)=> TOk,
) {
    const res = await fetch(url, {
        method,
        body: data
    });
    processReq(handler, res, mapper);
}
