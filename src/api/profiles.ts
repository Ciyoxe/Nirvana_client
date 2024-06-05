import { sendRequest, ResponseHandler } from "./sendRequest";

type ActionReq = {
    profileId: string,
}
type CreateReq = {
    name   : string,
    avatar : string | null,
}
type UpdateReq = {
    profileId: string,
    name?    : string,
    about?   : string | null,
    avatar?  : string | null,
    banner?  : string | null,
}
type RateReq = {
    profileId: string,
    rating   : "up" | "down",
}


type ErrRes = {
    error: string,
}
type SuccessRes = {
    success: true
}
type GetRes = {
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
    isBlocked   : boolean;
};
type CreateRes = {
    profileId: string,
}
type DeleteRes = {
    activeId: string | null,
}
type GetListRes = {
    profiles: {
        _id    : string,
        active : boolean,
        name   : string,
        rating : number,
        avatar : string | null,
        about  : string | null,
    }[]
}

export async function getProfile(req: ActionReq, handler: ResponseHandler<GetRes, ErrRes>) {
    await sendRequest("get", `api/profile/${req.profileId}`, {}, handler, 
        (v) => ({ ...v, created: new Date(v.created), online: new Date(v.online) })
    );
}
export async function createProfile(req: CreateReq, handler: ResponseHandler<CreateRes, ErrRes>) {
    await sendRequest("post", "api/profile", req, handler);
}
export async function deleteProfile(req: ActionReq, handler: ResponseHandler<DeleteRes, ErrRes>) {
    await sendRequest("delete", `api/profile/${req.profileId}`, {}, handler);
}
export async function getProfilesList(handler: ResponseHandler<GetListRes, ErrRes>) {
    await sendRequest("get", "api/profile/list", {}, handler);
}
export async function updateProfile(req: UpdateReq, handler: ResponseHandler<SuccessRes, ErrRes>) {
    await sendRequest("put", `api/profile/${req.profileId}`, { ...req, profileId: undefined }, handler);
}
export async function setActiveProfile(req: ActionReq, handler: ResponseHandler<SuccessRes, ErrRes>) {
    await sendRequest("post", `api/profile/set-active`, req, handler);
}
export async function rateProfile(req: RateReq, handler: ResponseHandler<SuccessRes, ErrRes>) {
    await sendRequest("post", `api/profile/rate`, req, handler);
}
export async function subscribe(req: ActionReq, handler: ResponseHandler<SuccessRes, ErrRes>) {
    await sendRequest("post", `api/profile/subscribe`, req, handler);
}
export async function unsubscribe(req: ActionReq, handler: ResponseHandler<SuccessRes, ErrRes>) {
    await sendRequest("post", `api/profile/unsubscribe`, req, handler);
}
export async function unsubscribeAll(handler: ResponseHandler<SuccessRes, ErrRes>) {
    await sendRequest("post", `api/profile/unsubscribe-all`, {}, handler);
}
export async function block(req: ActionReq, handler: ResponseHandler<SuccessRes, ErrRes>) {
    await sendRequest("post", `api/profile/block`, req, handler);
}
export async function unblock(req: ActionReq, handler: ResponseHandler<SuccessRes, ErrRes>) {
    await sendRequest("post", `api/profile/unblock`, req, handler);
}
export async function unblockAll(handler: ResponseHandler<SuccessRes, ErrRes>) {
    await sendRequest("post", `api/profile/unblock-all`, {}, handler);
}
