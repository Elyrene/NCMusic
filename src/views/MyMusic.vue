<script setup lang="ts">

import { api } from '@/api';
import { useUserStore } from '@/stores/user';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const isLodding = ref<boolean>(false);

const router = useRouter();
const userStore = useUserStore();

const playlists = ref<playList[]>([]);

const fetchUserPlaylists = async () => {
    isLodding.value = true;
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
        // console.log(playlists.value);
        isLodding.value = false;
    } catch(err) {
        console.log("获取用户歌单失败", err);
        isLodding.value = false;
    }
}

const handlePlaylistClick = (id: number) => {
  if (!id) return;
  router.push({
    name: "musiclist",
    query: {id},
  });
}

const handleGoLogin = () => {
    router.push('/login');
}

onMounted(() => {
    fetchUserPlaylists();
})

</script>

<template>
    <div class="mymusic-page">
        <div class="mymusic-inner">
            <h2 class="title">我的音乐</h2>
            <div v-if="!userStore.isLoggedIn" class="login-hint">
                <p class="hint-text">您还未登录，请先登录后查看个人歌单</p>
                <button class="hint-btn" type="button" @click="handleGoLogin">去登录</button>
            </div>
            <div v-else>
                <p class="subtitle">我的歌单</p>
                <div v-if="isLodding" class="tip">正在加载中...</div>
                <div v-else-if="!playlists.length" class="tip">暂无歌单，快去创建吧</div>
                <ul class="playlist-list">
                    <li
                    v-for="item in playlists"
                    :key="item.id"
                    class="playlist-item"
                    @click="handlePlaylistClick(item.id)"
                    >
                    <div class="cover">
                        <img :src="item.cover" :alt="item.desc">
                    </div>
                    <div class="info">
                        <p class="name">{{ item.title }}</p>
                        <p class="count">{{ item.trackCount }}首歌</p>
                    </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style scoped>
.mymusic-page {
    min-height: calc(100vh - 90px);
    padding: 24px 32px;
    box-sizing: border-box;
}

.mymusic-inner {
    max-width: 1200px;
    margin: 0 auto;
}

.title {
    margin: 0 0 16px;
    font-size: 20px;
    font-weight: 600;
}

.login-hint {
    margin-top: 24px;
    padding: 24px 28px;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.hint-text {
    margin: 0 0 12px;
    font-size: 14px;
    color: #555;
}

.hint-btn {
    padding: 6px 16px;
    border-radius: 16px;
    border: none;
    background: #c20c0c;
    color: #fff;
    font-size: 14px;
    cursor: pointer;
}

.subtitle{
    margin: 0 0 12px;
    font-size: 16px;
    color: #333;
}

.tip {
    margin-top: 16px;
    font-size: 14px;
    color: #777;
}

.playlist-list {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
    list-style: none;
    margin: 12px;
    padding: 0;
}

.playlist-item {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
    overflow: hidden;
}

.cover {
    width: 100%;
    aspect-ratio: 1/1;
    overflow: hidden;
    cursor: pointer;
}

.cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: all 0.3s ease;
}

.cover:hover img {
    transform: scale(1.06);
}

.info {
    padding: 8px 10px 10px;
}

.name {
    margin:  0 0 4px;
    font-size: 14px;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.count {
    margin: 0;
    font-size: 12px;
    color: #999;
}

</style>