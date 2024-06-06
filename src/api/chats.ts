import { sendRequest, ResponseHandler } from "./sendRequest";
import { ChatPreview } from "./types";

type ActionReq = {
    chatId: string,
}
type SendMessageReq = {
    chatId : string,
    text   : string,
};
type LoadChatsReq = {
    count  : number,
    offset : number,
};
type LoadMessagesReq = {
    chatId : string,
    count  : number,
    offset : number,
};
type CreatePersChatReq = {
    profileId: string,
};
type EnterAnonChatReq = {
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
type RateAnonChatReq = {
    chatId : string,
    rate   : "up" | "down",
};

type ErrRes = {
    error: string,
}
type SuccessRes = {
    success: true,
}
type SendMessageRes = {
    messageId: string,
}
type LoadChatsRes = {
    count: number,
    chats: ChatPreview[]
}
type LoadMessagesRes = {
    count    : number,
    messages : {
        id      : string,
        text    : string,
        sender  : string | null,
        created : Date,
    }[]
}
type CreateChatRes = {
    chatId: string,
};


export async function sendMessage(req: SendMessageReq, handler: ResponseHandler<SendMessageRes, ErrRes>) {
    await sendRequest("post", "api/chat/send-message", req, handler);
}
export async function loadChats(req: LoadChatsReq, handler: ResponseHandler<LoadChatsRes, ErrRes>) {
    await sendRequest("post", "api/chat/load-chats", req, handler);
}
export async function loadMessages(req: LoadMessagesReq, handler: ResponseHandler<LoadMessagesRes, ErrRes>) {
    await sendRequest("post", "api/chat/load-messages", req, handler);
}
export async function createChat(req: CreatePersChatReq, handler: ResponseHandler<CreateChatRes, ErrRes>) {
    await sendRequest("post", "api/chat/personal", req, handler);
}
export async function deleteChat(req: ActionReq, handler: ResponseHandler<SuccessRes, ErrRes>) {
    await sendRequest("delete", `api/chat/personal/${req.chatId}`, {}, handler);
}
export async function enterAnonQueue(req: EnterAnonChatReq, handler: ResponseHandler<SuccessRes, ErrRes>) {
    await sendRequest("post", "api/chat/anonymous/enter-queue", req, handler);
}
export async function leaveAnonQueue(handler: ResponseHandler<SuccessRes, ErrRes>) {
    await sendRequest("post", "api/chat/anonymous/leave-queue", {}, handler);
}
export async function leaveAnonChat(req: ActionReq, handler: ResponseHandler<SuccessRes, ErrRes>) {
    await sendRequest("post", "api/chat/anonymous/leave-chat", req, handler);
}
export async function rateAnonChat(req: RateAnonChatReq, handler: ResponseHandler<SuccessRes, ErrRes>) {
    await sendRequest("post", "api/chat/anonymous/rate-user", req, handler);
}
export async function blockAnonChat(req: ActionReq, handler: ResponseHandler<SuccessRes, ErrRes>) {
    await sendRequest("post", "api/chat/anonymous/block-user", req, handler);
}