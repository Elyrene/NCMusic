<script setup lang="ts">

import { onMounted, ref } from 'vue';
import { api } from '@/api';
import type { Post } from '@/api/request';

const playlists = ref([]);

const fetchPlaylist = async () => {
  try {
    const data = await api.get<Post>('/personalized', { limit:5 });
      console.log(data.code);
  } catch(err) {
    console.log("获取失败", err);
  }
}

onMounted(() => {
  fetchPlaylist();
})

</script>

<template>
  <main>
  </main>
</template>
