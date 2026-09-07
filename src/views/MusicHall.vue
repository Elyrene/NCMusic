<script setup lang="ts">

import { onMounted, ref } from 'vue';
import { api } from '@/api';

const playlists = ref<playList[]>([]);

const newSongs = ref<NewSong[]>([])

const fetchPlaylist = async () => {
  try {
    const data = await api.get<PersonalizedRes>('/personalized', { limit:5 });

    playlists.value = (data.result || []).map((item) => ({
      id: item.id,
      title: item.name,
      desc: item.copyright,
      cover: item.picUrl,
    }));
    console.log(playlists.value);
  } catch(err) {
    console.log("推荐歌单获取失败", err);
  }
}

const fetchNewSongs = async () => {
  try {
    const data = await api.get<PersonalizedNewSongRes>('/personalized/newsong');

    newSongs.value = (data.result || []).map((item) => ({
      id: item.id,
      name: item.name,
      cover: item.picUrl,
      artist: item.song?.artists?.map((a) => a.name).join('/') || '',
    }));
    console.log(newSongs.value);
  } catch(err) {
    console.log("推荐新音乐失败", err);
  }
}

onMounted(() => {
  fetchPlaylist();
  fetchNewSongs();
})

</script>

<template>
  <div class="hall-wrapper">
    <div class="hall-inner">
      <h2 class="section-title">推荐歌单</h2>
      <ul class="playlist-list">
        <li 
        v-for="item in playlists"
        :key="item.id"
        class="playlist-item"
        >
          <div class="cover-wrapper">
            <img :src="item.cover" :alt="item.title">
          </div>
          <div class="info">
            <p class="title">{{ item.title }}</p>
            <p class="desc">{{  item.desc }}</p>
          </div>
        </li>
      </ul>
      <h2 class="section-title section-title--sub">推荐新音乐</h2>
      <ul class="song-list">
        <li 
          class="song-item"
          v-for="song in newSongs"
          :key="song.id"
        >
          <div class="song-cover">
            <img :src="song.cover" :alt="song.name">
          </div>
          <div class="song-info">
            <p class="song-name">{{ song.name }}</p>
            <p class="song-artist">{{ song.artist }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>

.hall-wrapper {
  display: flex;
  justify-content: center;
}

.hall-inner {
  width: 100%;
  max-width: 1200px;
}

.section-title {
  margin: 0 0 16px;
  margin-top: 40px;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.section-title--sub {
  margin-top: 40px;
}

.section-title--singer {
  margin-top: 68px;
  font-size: 22px;
  text-align: center;
}

.playlist-list {
  display: flex;
  gap: 20px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.playlist-item {
  flex: 1;
  max-width: 220px;
  cursor: pointer;
}

.cover-wrapper {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 4px;
  overflow: hidden;
  background-color: #eee;
  cursor: pointer;
}

.cover-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.cover-wrapper:hover img {
  transform: scale(1.06);
}

.info {
  margin-top: 8px;
}

.title {
  font-size: 14px;
  color: #333;
  margin: 0 0 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.desc {
  font-size: 12px;
  color: #999;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px 40px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.song-item { 
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.song-cover {
  width: 82px;
  height: 82px;
  border-radius: 4px;
  overflow: hidden;
  background: #eee;
  flex-shrink: 0;
  cursor: pointer;
}

.song-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: 0.3s ease;
}

.song-cover:hover img {
  transform: scale(1.2);
}

.song-info {
  flex: 1;
}

.song-name {
  font-size: 14px;
  color: #333;
  margin: 0 0 4px;
  white-space: nowrap;
}

.song-artist {
  font-size: 12px;
  color: #999;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

</style>
