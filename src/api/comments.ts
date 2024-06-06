import { ResponseHandler, sendRequest } from "./sendRequest"

type ActionReq = {
    commentId: string,
}
type PublishReq = {
    text   : string,
    postId : string,
    replyTo: string | null,
}
type LoadReq = {
    count     : number,
    offset    : number,
    postId    : string
    minRating : number,
    maxRating : number,
}
type rateReq = {
    rating    : "up" | "down",
    commentId : string,
}

type ErrRes = {
    error: string,
}
type SuccessRes = {
    success: true
}
type PublishRes = {
    commentId: string,
}
type LoadRes = {
    count   : number,
    comments: {
        post    : string,
        author  : string,
        replyTo : string | null,
        created : Date,
        text    : string,
        rating  : number,
    }[]
}


export async function getComment(req: ActionReq, handler: ResponseHandler<LoadRes, ErrRes>) {
    await sendRequest("get", `/api/comment/${req.commentId}`, {}, handler);
}
export async function publishComment(req: PublishReq, handler: ResponseHandler<PublishRes, ErrRes>) {
    await sendRequest("post", "/api/comment", req, handler);
}
export async function loadComments(req: LoadReq, handler: ResponseHandler<LoadRes, ErrRes>) {
    await sendRequest("post", "/api/comment/load-list", req, handler, 
        (v) => {
            for (const comment of v.comments)
                comment.created = new Date(comment.created);
            return v;
        }
    );
}
export async function rateComment(req: rateReq, handler: ResponseHandler<SuccessRes, ErrRes>) {
    await sendRequest("post", "/api/comment/rate", req, handler);
}
