export type ResponseHandler<TOk, TErr> =  {
    200?: (json: TOk) => void,

    429?: (err: TErr) => void,
    404?: (err: TErr) => void,
    400?: (err: TErr) => void,
    
    /** any error */
    _?  : (status: number, err: TErr | null)=> void, 
};

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

    try {
        const json = await res.json();

        switch (res.status) {
            case 200:
                if (mapper)
                    handler[200]?.(mapper(json));
                else
                    handler[200]?.(json);
                break
            case 429:
                handler[429]?.(json);
                handler._?.(res.status, json);
                break;
            case 404:
                handler[404]?.(json);
                handler._?.(res.status, json);
                break;
            case 400:
                handler[400]?.(json);
                handler._?.(res.status, json);
                break;
            default:
                handler._?.(res.status, json);
        }
    } 
    catch (_) {
        handler._?.(res.status, null);
    };
}
export async function sendFormdata<TOk, TErr>(
    method  : string, 
    url     : string, 
    data    : FormData, 
    handler : ResponseHandler<TOk, TErr>
) {
    const res = await fetch(url, {
        method,
        body: data
    });

    try {
        const json = await res.json();

        switch (res.status) {
            case 200:
                handler[200]?.(json);
                break
            case 429:
                handler[429]?.(json);
                handler._?.(res.status, json);
                break;
            case 404:
                handler[404]?.(json);
                handler._?.(res.status, json);
                break;
            case 400:
                handler[400]?.(json);
                handler._?.(res.status, json);
                break;
            default:
                handler._?.(res.status, json);
        }
    } 
    catch (_) {
        handler._?.(res.status, null);
    };
}
