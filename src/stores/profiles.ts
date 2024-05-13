import { defineStore } from "pinia";

export const useProfilesStore = defineStore("app", {
    state: () => ({
        profiles      : [] as string[],
        activeProfile : null as string | null,
    }),
    actions: {
        updateProfiles() {
            
        },
        setActiveProfile(id: string) {
            
        },
    },
});