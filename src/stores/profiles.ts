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

            if (id === null)
                localStorage.setItem("profileId", "");
            else
                localStorage.setItem("profileId", id);
        },
        appendProfile(profile: ProfilePreview) {
            this.userProfiles.push(profile);
        }
    },
});


// profile syncronization across tabs
setInterval(() => {
    const currentProfileId = localStorage.getItem("profileId");

    if (currentProfileId === null)
        return;

    if (currentProfileId === "")
        useProfilesStore().setCurrentProfile(null);
    else
        useProfilesStore().setCurrentProfile(currentProfileId);
}, 5_000);