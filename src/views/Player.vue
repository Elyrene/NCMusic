<script setup lang="ts">

import { api } from '@/api';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const songId = computed(() => Number(route.query.id) || 0);

const lyrics = ref<string[]>([]);

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
        // console.log(data.lrc.lyric);
        parseLyric(data.lrc?.lyric || '');
        lyrics.value = parseLyric(data.lrc.lyric);
        console.log(lyrics.value);
    } catch (err) {
        console.log("获取歌词失败", err);
        lyrics.value = [];
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
                        <div class="cover-disc">
                            <img :src="songInfo.cover" :alt="songInfo.name">
                        </div>
                    </div>
                    <div class="song-meta">
                        <h2 class="song-title">{{ songInfo.name }}</h2>
                        <p class="song-artist">{{ songInfo.artist}}</p>
                        <p class="song-album">{{ songInfo.album }}</p>
                    </div>
                </div>
                <!-- 歌词 -->
                <div class="player-right">
                    <div class="lyrics-card">
                        <h3 class="lyrics-title">歌词</h3>
                        <div class="lyrics-content">
                            <template v-if="lyrics.length">
                                <p 
                                v-for="(line, index) in lyrics"
                                :key="index"
                                :class="{ 'lyrics-line--heightlight' : index == 0}"
                                class="lyrics-line"
                                >
                                    {{ line }}
                                </p>
                            </template>
                            <p v-else class="lyrics-line">暂无歌词</p>
                        </div>
                    </div>
                </div>
                <!-- 进度条 -->
            </div>
        </div>
    </div>
</template>

<style scoped>
.player-page {
    min-height: calc(100vh - 90px);
    background: radial-gradient(circle at top left, #2b2b2b, #000);
    color: #f5f5f5;
    display: flex;
    justify-content: center;
    padding: 40px 0;
    box-sizing: border-box;
}

.player-inner {
    width: 100%;
    max-width: 1200px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 32px;
}

.player-main {
    width: 100%;
    display: flex;
    gap: 32px;
}

.player-left {
    width: 320px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.cover-wrap {
    width: 260px;
    height: 260px;
    border-radius: 50%;
    background: radial-gradient(circle, #444, #111);
}

.cover-disc {
    width: 220px;
    height: 220px;
    border-radius: 50%;
    overflow: hidden;
}

.cover-disc img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.song-meta {
    margin-top: 20px;
    text-align: center;
}

.song-title {
    margin: 0;
    font-size: 22px;
    font-weight: 600;
}

.song-artist,
.song-album {
    margin: 6px 0 0;
    font-size: 13px;
    color: #cfcfcf;
}

.player-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.lyrics-card {
    width: 100%;
    max-height: 520px;
    padding: 18px 24px;
    border-radius: 16px;
    background: transparent;
    box-shadow: none;
    box-sizing: border-box;
}

.lyrics-title {
    margin: 0 0 16px;
    font-size: 18px;
    color: #fff;
    text-align: center;
    letter-spacing: 1px;
}

.lyrics-content {
    max-height: 640px;
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 0;
    scrollbar-width: none;
    scrollbar-color: transparent transparent;
}

.lyrics-content::-webkit-scrollbar {
    width: 0;
    height: 0;
}

.lyrics-line {
    margin: 6px 0;
    font-size: 16px;
    line-height: 1.6;
    text-align: center;
    color: rgba(255, 255, 255, 0.65);
    transition: color 0.2 ease, transform 0.2s ease;
    white-space: normal;
}

.lyrics-line--heightlight {
    color: #ffffff;
    font-size: 18px;
    font-weight: 600;
    transform: scale(1.02);
}

</style>