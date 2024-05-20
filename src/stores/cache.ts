import { sendRequest } from "@/utils";
import { defineStore } from "pinia";
import { toRef } from "vue";

type ProfileCache = {
    cacheTime : number,
    accessTime: number,

    data : null | {
        name      : string,
        about     : string | null,
        avatar    : string | null,
        banner    : string | null,
        created   : string,
        online    : string,
        role      : "user" | "admin",
        rating    : number,
        following : number,
        followers : number,
    }
};

export const useCacheStore = defineStore("cache", {
    state: () => ({
        profiles: { } as { [key: string]: ProfileCache },
    }),
    actions: {
        loadProfile(profileId: string, force = false) {
            if (force ||
                this.profiles[profileId] === undefined ||
                this.profiles[profileId].cacheTime + 1000 * 60 * 10 < Date.now()
            ) {
                sendRequest("post", "/api/profile/get-info", { profileId }, {
                    200: (json) => {
                        this.profiles[profileId] = {
                            cacheTime : Date.now(),
                            accessTime: Date.now(),
                            data      : json
                        };
                    },
                });
            }
            if (this.profiles[profileId] === undefined) {
                this.profiles[profileId] = {
                    cacheTime : Date.now(),
                    accessTime: Date.now(),
                    data      : null
                };
            }
            
            this.profiles[profileId].accessTime = Date.now();
            
            return toRef(()=> this.profiles[profileId]?.data ?? null);
        },
    },
})

setInterval(() => {
    const cache      = useCacheStore();
    const cacheSize  = Object.keys(cache.profiles).length;
    const deletedIds = [] as string[];

    
    if (cacheSize > 10000) {
        for (const id in cache.profiles) {
            if (cacheSize - deletedIds.length < 10000)
                break;
            deletedIds.push(id);
        }  
    }
    if (cacheSize > 5000) {
        for (const id in cache.profiles) {
            if (cacheSize - deletedIds.length < 5000)
                break;
            if (cache.profiles[id].accessTime + 1000 * 60 * 5 < Date.now())
                deletedIds.push(id);
        }
    }

    for (const id of deletedIds) {
        delete cache.profiles[id];
    }
}, 1000 * 60);