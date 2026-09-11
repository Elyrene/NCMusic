<script setup lang="ts">

import { Pause, Play } from '@lucide/vue';
import { api } from '@/api';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const songId = computed(() => Number(route.query.id) || 0);

const audioRef = ref<HTMLAudioElement | null>(null);

const lyricLines = ref<LyricLine[]>([]);

const songInfo = ref<Song>({
    name: '未知歌曲',
    artist: '未知歌手',
    album: '未知专辑',
    cover: '',
})

const audioUrl = ref<string>('');
const currentTime = ref<number>(0);
const duration = ref<number>(0);
const isPlay = ref<boolean>(false);

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
            cover: detail.al?.picUrl ?? detail.album?.picUrl ?? '' ,
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
        lyricLines.value = parseLyric(data.lrc.lyric || '');
        // console.log(lyrics.value);
    } catch (err) {
        console.log("获取歌词失败", err);
        lyricLines.value = [];
    }
}

const fetchSongUrl = async () => {
    const id: number = songId.value;
    if (!id) return;
    try {
        const data = await api.get<SongUrlRes>("/song/url", { id: id });
        audioUrl.value = data.data[0]?.url || '';
        console.log(audioUrl.value);
        duration.value = 0;
        currentTime.value = 0;
        isPlay.value = false;
        
    } catch(err) {
        console.log("获取音乐播放地址失败", err);
        audioUrl.value = '';
        isPlay.value = false;
    }
}

const handleLoadedMetadata = () => {
    const audio = audioRef.value;
    if (!audio) return;
    duration.value = audio.duration || 0;
    currentTime.value = audio.currentTime || 0;
}

const parseLyric = (lyric: string = ''): LyricLine[] => {
    return lyric.split('\n')
        .map((line) => line.trim())
        .filter((line) => line)
        .flatMap((line) => {
            const times = [...line.matchAll(/\[(\d{1,2}):(\d{1,2}(?:\.\d{1,3})?)\]/g)]
                .map((m) => Number(m[1]) * 60 + Number(m[2]));
            const text = line.replace(/\[[^\]]*]/g, '').trim();
            if(!times.length || !text.length) return[];
            return times.map((time) => ({ time, text }));
        })
        .sort((a, b) => a.time - b.time);
}

const formateTime = (sec: number) => {
    if (!sec || !Number.isFinite(sec)) return '00:00';
    const s = Math.floor(sec);
    const m = Math.floor(s / 60);
    const rs = s % 60;
    const mm = m.toString().padStart(2, '0');
    const ss = rs.toString().padStart(2, '0');
    return `${mm}:${ss}`;
}

const activeIndex = computed(() => {
    const audio = audioRef.value;

    if(!audio || currentTime.value <= 0) return -1;
    const time = currentTime.value;
    let index = -1;
    for(let i = 0; i < lyricLines.value.length; i++ ) {
        const line = lyricLines.value[i];
        if(!line) break;
        if(line.time <= time) {
            index = i;
        } else {
            break;
        }
    }
    return index;
})

const seekTo = (time: number) => {
    const audio = audioRef.value;
    if(!audio) return;
    audio.currentTime = time;
    currentTime.value = time;
}

const handleTogglePlay = () => {
    const audio = audioRef.value;
    if (!audio) return;
    if (audio.paused) {
        audio.play().then(() => {
            isPlay.value = true;
        }).catch(() => {});
    } else {
        audio.pause();
        isPlay.value = false;
    }
}

const handleAudioEnded = () => {
    isPlay.value = false;
}

const handleTimeUpdate = () => {
    const audio = audioRef.value;
    if(!audio) return;
    currentTime.value = audio.currentTime || 0;
}

const handleProgressClick = (event: MouseEvent) => {
    const bar = event.currentTarget as HTMLElement;
    const audio = audioRef.value;
    if(!audio || !bar) return;

    const rect = bar.getBoundingClientRect();
    if (rect.width === 0) return;
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));

    const newTime = duration.value * ratio;
    audio.currentTime = newTime;
    currentTime.value = newTime;
}

onMounted(() => {
    void Promise.allSettled([fetchSongDetail(), fetchLyric(), fetchSongUrl()]);
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
                            <template v-if="lyricLines.length">
                                <p 
                                @click="seekTo(line.time)"
                                v-for="(line, index) in lyricLines"
                                :key="index"
                                :class="{ 'lyrics-line--heightlight' : index == activeIndex}"
                                class="lyrics-line"
                                >
                                    {{ line.text }}
                                </p>
                            </template>
                            <p v-else class="lyrics-line">暂无歌词</p>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 进度条 -->
            <div class="player-controls">
                <div class="controls-main">
                    <button class="btn-circle btn-large" @click="handleTogglePlay">
                        <Pause v-if="isPlay"/>
                        <Play v-else/>
                    </button>
                </div>
                <div class="progress-wrap">
                    <span class="time-label">{{ formateTime(currentTime) }}</span>
                    <div class="progress-bar" @click="handleProgressClick">
                        <div class="progress-inner" :style="{ width: duration ? `${(currentTime / duration) * 100}%`: '0%' }"></div>
                    </div>
                    <span class="time-label">{{ formateTime(duration) }}</span>
                </div>
                <audio 
                v-if="audioUrl"
                class="audio-hidden"
                ref="audioRef"
                :src="audioUrl"
                @loadedmetadata="handleLoadedMetadata"
                @timeupdate="handleTimeUpdate"
                @ended="handleAudioEnded"
                ></audio>
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
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 20px 40px rgba(255, 255, 255, 0.7);
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
    max-height: 460px;
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
    transition: all 0.4s ease;
    cursor: pointer;
}

.lyrics-line--heightlight {
    color: #ffffff;
    font-size: 18px;
    font-weight: 600;
    transform: scale(1.02);
}

.player-controls {
    width: 100%;
    padding: 16px 24px 0 ;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.audio-hidden {
    display: none;
}

.controls-main {
    display: flex;
    align-items: center;
    gap: 24px;
}

.btn-circle {
    border-radius: 50%;
    border: none;
    cursor: pointer;
    background: #fff;
    color: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 04);
    transition: all 0.3s ease;
}

.btn-large {
    width: 56px;
    height: 56px;
    font-size: 22px;
}

.btn-small {
    width: 40px;
    height: 40px;
    font-size: 18px;
}

.btn-circle:hover {
    background: #ff416c;
    color: #fff;
    transform: translateY(-2px);
}

.progress-wrap {
    display: flex;
    align-items: center;
    gap: 12px;
}

.time-label {
    font-size: 12px;
    color: #c0c0c0;
}

.progress-bar {
    flex: 1;
    height: 4px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.2);
    overflow: hidden;
    cursor: pointer;
    transition: all 0.2s;
}

.progress-bar:hover {
    flex: 1;
    height: 6px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.2);
    overflow: hidden;
    cursor: pointer;
}

.progress-inner {
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, #ff4b2b, #ff416c);
}

.controls-extra {
    display: none;
}

.extra-left,
.extra-right {
    display: none;
}

.btn-text {
    display: none;
}

.btn-text:hover {
    color: #fff;
}

@media (max-width: 960px) {
    .player-inner {
        flex-direction: column;
    }

    .player-main {
        flex-direction: column;
        align-items: center;
    }

    .player-left {
        width: auto;
    }
}

</style>