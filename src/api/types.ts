export type Profile = {
    self        : boolean,
    name        : string,
    about       : string | null,
    avatar      : string | null,
    banner      : string | null,
    created     : Date,
    online      : Date,
    role        : "admin" | "user",
    rating      : number,
    following   : number,
    followers   : number,
    isFollowing : boolean,
    isBlocked   : boolean,
};
export type ProfilePreview = {
    _id    : string,
    active : boolean,
    name   : string,
    rating : number,
    avatar : string | null,
    about  : string | null,
}

export type ChatPreview = {
    id       : string,
    type     : "personal" | "anonymous",
    name     : string,
    preview  : string | null,
    lastDate : Date,
}
export type Message = {
    id         : string,
    text       : string,
    sender     : string | null,
    senderName : string,
    created    : Date,
}
export type AnonSettings = {
    gender  : "m" | "f" | null,
    age     : number | null,
    filter: {
        gender    : "m" | "f" | null,
        minAge    : number | null,
        maxAge    : number | null,
        minRating : number | null,
        maxRating : number | null,
    },
};