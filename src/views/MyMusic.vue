<script setup lang="ts">

import { api } from '@/api';
import { useUserStore } from '@/stores/user';
import { onMounted, ref } from 'vue';

const userStore = useUserStore();

const playlists = ref<playList[]>([]);

const fetchUserPlaylists = async () => {
    const uid = userStore.user?.id;
    if(!uid) return;
    try{
        const data = await api.get<UserPlayListRes>('/user/playlist', {
            uid: uid,
            cookie: userStore.cookie,
        })
        playlists.value = data.playlist?.map((item) => ({
            id: item.id,
            title: item.name,
            cover: item.coverImgUrl,
            trackCount: item.trackCount,
        })) || [];
        console.log(playlists.value);
    } catch(err) {
        console.log("获取用户歌单失败", err);
    }
}

onMounted(() => {
    fetchUserPlaylists();
})

</script>

<template>
    我的音乐
</template>

<style scoped>

</style>