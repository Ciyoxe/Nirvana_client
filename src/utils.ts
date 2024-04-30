
type ResponseHandler =  { [key: number | string]: (json: any)=> void };

export async function sendPost(url: string, data: object, handler: ResponseHandler) {
    const res = await fetch(url, {
        method: "POST",
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