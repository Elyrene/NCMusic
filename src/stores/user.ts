import { defineStore } from "pinia";
import { computed, ref } from "vue";

const STORAGE_KEY = 'nc_music';

export const useUserStore = defineStore('user',() => {
    const user = ref<userInfo | null>(null);

    const isLoggedIn = computed(() => !!user.value);

    const persist = (data: userInfo | null) => {
        if (data) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    }

    const setUser = (payload: userInfo) => {
        const normalized: userInfo = {
            id: payload.id,
            nickname: payload.nickname,
            avatar: payload.avatar,
        }
        user.value = normalized;
        persist(normalized);
    }

    const clearUser = () => {
        user.value = null;
        persist(null);
    }

    const initFromLocal = () => {
        const raw = localStorage.getItem(STORAGE_KEY);
        if(!raw) return;

        try {
            const parsed: userInfo = JSON.parse(raw);
            if(parsed && parsed.id) {
                user.value = parsed;
            } else {
                persist(null);
            }
        } catch (error) {
            console.error('本地存储数据失败', error);
            persist(null);
        }
    }

    initFromLocal();

    return {
        user,
        isLoggedIn,
        setUser,
        clearUser,
    }
})