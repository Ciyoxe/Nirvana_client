
type ResponseHandler =  { [key: number | string]: (json: any)=> void };

export async function sendRequest(method: string, url: string, data: object, handler: ResponseHandler) {
    const res = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    let json = {};
    try {
        json = await res.json();
    } 
    catch (_) {};

    if (handler[res.status])
        handler[res.status](json ?? {});
    else if (handler["_"])
        handler["_"](json ?? {});
}
export async function sendGet(url: string, handler: ResponseHandler) {
    const res = await fetch(url, {
        method: "get",
    });

    let json = {};
    try {
        json = await res.json();
    } 
    catch (_) {};

    if (handler[res.status])
        handler[res.status](json ?? {});
    else if (handler["_"])
        handler["_"](json ?? {});
}