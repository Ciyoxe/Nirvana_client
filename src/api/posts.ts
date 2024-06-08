import { sendRequest, ResponseHandler } from "./sendRequest";
import { Content, Post, PostPreview } from "./types";

type PublishReq = {
    about   : string | null,
    public  : boolean,
    header  : string,
    content : Content,
}
type ActionReq = {
    postId: string,
}
type LoadReq = {
    feed      : "personal" | "public",
    minRating : number,
    maxRating : number,
    count     : number,
    offset    : number,
} | {
    feed      : "author",
    profileId : string,
    count     : number,
    offset    : number,
}
type RateReq = {
    rating: "up" | "down",
    postId: string,
}

type ErrRes = {
    error: string,
}
type SuccessRes = {
    success: true
}
type PublishRes = {
    postId: string,
}
type LoadRes = {
    count: number,
    posts: PostPreview[]
}

export async function publishPost(req: PublishReq, handler: ResponseHandler<PublishRes, ErrRes>) {
    await sendRequest("post", "/api/post", req, handler);
}
export async function getPost(req: ActionReq, handler: ResponseHandler<Post, ErrRes>) {
    await sendRequest("get", `/api/post/${req.postId}`, {}, handler,
        (v) => ({ ...v, created: new Date(v.created) })
    );
}
export async function deletePost(req: ActionReq, handler: ResponseHandler<SuccessRes, ErrRes>) {
    await sendRequest("delete", `/api/post/${req.postId}`, {}, handler);
}
export async function loadPosts(req: LoadReq, handler: ResponseHandler<LoadRes, ErrRes>) {
    await sendRequest("post", "/api/post/load-list", req, handler,
        (v) => {
            for (const post of v.posts)
                post.created = new Date(post.created);
            return v;
        }
    );
}
export async function ratePost(req: RateReq, handler: ResponseHandler<SuccessRes, ErrRes>) {
    await sendRequest("post", `/api/post/rate`, req, handler);
}