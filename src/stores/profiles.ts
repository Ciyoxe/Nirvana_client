import { defineStore    } from "pinia";
import { ProfilePreview } from "@/api/types";

export const useProfilesStore = defineStore("profiles", {
    state: () => ({
        userProfiles     : [] as ProfilePreview[],
        currentProfileId : null as string | null,
    }),
    actions: {
        setCurrentProfile(id: string | null) {
            this.currentProfileId = id;
            localStorage.setItem("profileId", id ?? "");
        },
        appendProfile(profile: ProfilePreview) {
            this.userProfiles.push(profile);
        }
    },
});


// profile syncronization across tabs
const store     = useProfilesStore();
const syncStore = ()=> {
    const currentProfileId = localStorage.getItem("profileId");

    if (currentProfileId === null)
        return;

    if (currentProfileId === "")
        store.setCurrentProfile(null);
    else
        store.setCurrentProfile(currentProfileId);

    setTimeout(syncStore, 5_000);
}
syncStore();