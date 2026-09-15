import { defineStore } from "pinia";
import { computed, ref } from "vue";

const STORAGE_KEY = 'nc_music';

export const useUserStore = defineStore('user',() => {
    const user = ref<userInfo | null>(null);
    const cookie = ref<string>('');

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
            cookie: payload.cookie ||  cookie.value,
        }
        user.value = normalized;
        cookie.value = normalized.cookie || '';
        persist(normalized);
    }

    const setCookie = (val: string) => {
        if (!val) return;
        cookie.value = val;
        if (user.value) {
            user.value.cookie = val;
            persist(user.value);
        } else {
            localStorage.setItem(STORAGE_KEY + '_cookie', JSON.stringify(val));
        }
    }

    const clearUser = () => {
        user.value = null;
        cookie.value = '';
        persist(null);
        localStorage.removeItem(STORAGE_KEY + '_cookie');
    }

    const initFromLocal = () => {

        const rawCookie = localStorage.getItem(STORAGE_KEY + '_cookie');
        if (rawCookie) {
            try {
                cookie.value = JSON.parse(rawCookie);
            } catch(err) {
                console.log('本地初始化token失败', err);
            }
        }

        const raw = localStorage.getItem(STORAGE_KEY);
        if(!raw) return;

        try {
            const parsed: userInfo = JSON.parse(raw);
            if(parsed && parsed.id) {
                user.value = parsed;
                cookie.value = parsed.cookie || cookie.value;
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
        cookie,
        isLoggedIn,
        setUser,
        setCookie,
        clearUser,
    }
})