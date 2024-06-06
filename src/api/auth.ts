import { sendRequest, ResponseHandler } from "./sendRequest";

type AuthReq = {
    username: string,
    password: string,
}
type CheckReq = {
    username: string,
}

type AuthRes = {
    success: true
}
type ErrRes = {
    error: string
}
type CheckRes = {
    exists: boolean
}

export async function login(req: AuthReq, handler: ResponseHandler<AuthRes, ErrRes>) {
    await sendRequest("post", "/api/auth/login", req, handler);   
}
export async function register(req: AuthReq, handler: ResponseHandler<AuthRes, ErrRes>) {
    await sendRequest("post", "/api/auth/signup", req, handler);   
}
export async function logout(handler: ResponseHandler<AuthRes, ErrRes>) {
    await sendRequest("post", "/api/auth/logout", {}, handler);   
}
export async function userExists(req: CheckReq, handler: ResponseHandler<CheckRes, ErrRes>) {
    await sendRequest("post", "/api/auth/username-exists", req, handler);
}