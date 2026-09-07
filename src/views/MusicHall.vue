<script setup lang="ts">

import { onMounted, ref } from 'vue';
import { api } from '@/api';
import type { PersonalizedResponse, PlaylistItem } from '@/api/response';

const playlists = ref<PlaylistItem[]>([]);

const fetchPlaylist = async () => {
  try {
    const data = await api.get<PersonalizedResponse>('/personalized', { limit:5 });
    playlists.value = data.result;
    console.log(playlists.value);
  } catch(err) {
    console.log("获取失败", err);
  }
}

onMounted(() => {
  fetchPlaylist();
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
            <img :src="item.picUrl" :alt="item.name">
          </div>
          <div class="info">
            <p class="title">{{ item.name }}</p>
            <p class="desc">{{  item.copyright }}</p>
          </div>
        </li>
      </ul>
      <h2 class="section-title">推荐新音乐</h2>
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

</style>
