<script setup lang="ts">

import { api } from '@/api';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const songId = computed(() => Number(route.query.id) || 0);

const lyrics = ref<string>();

const songInfo = ref<Song>({
    name: '未知歌曲',
    artist: '未知歌手',
    album: '未知专辑',
    cover: 'https://via.placeholder.com/260x260.png?text=Cover',
})

const fetchSongDetail = async () => {
    const ids: number = songId.value;
    if (!ids) return;
    try {
        const data = await api.get<SongDetailRes>("/song/detail", { ids: ids })
        const detail = data.songs?.[0];
        if (!detail) return;
        songInfo.value = {
            name: detail.name ?? '未知歌曲',
            artist: detail.ar?.[0]?.name ?? detail.artist?.[0]?.name ?? '未知歌手',
            album: detail.al?.name ?? detail.album?.name ?? '未知专辑',
            cover: detail.al?.picUrl ?? detail.album?.picUrl ?? 'https://via.placeholder.com/260x260.png?text=Cover' ,
        }
        // console.log(songInfo.value);
    } catch(err) {
        console.log("歌曲信息获取失败", err);
    }
}

const fetchLyric = async () => {
    const id: number = songId.value;
    if (!id) return;
    try {
        const data = await api.get<LyicRes>("/lyric", { id: id });
        console.log(data.lrc.lyric);
        parseLyric(data.lrc.lyric);
        console.log(parseLyric(data.lrc.lyric));
    } catch (err) {
        console.log("获取歌词失败", err);
    }
}

const parseLyric = (lyric: string = '') => {
    return lyric.split('\n')
        .map((line) => line.trim())
        .filter((line) => line)
        .map((line) => {
            const lyricText = line.replace(/^\[[^\]]*]/g, '').trim();
            return lyricText || line;
        });
}

onMounted(() => {
    void Promise.allSettled([fetchSongDetail(), fetchLyric()]);
});

</script>

<template>
    <div class="player-page">
        <div class="player-inner">
            <div class="player-main">
                <!-- 左侧 -->
                <div class="player-left">
                    <div class="cover-wrap">
                        <img :src="songInfo.cover" :alt="songInfo.name">
                    </div>
                    <div class="song-meta">
                        <h2 class="song-people">{{ songInfo.name }}</h2>
                        <p class="song-artist">{{ songInfo.artist}}</p>
                        <p class="song-album">{{ songInfo.album }}</p>
                    </div>
                </div>
                <!-- 歌词 -->
                
                <!-- 进度条 -->
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>