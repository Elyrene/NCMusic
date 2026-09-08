<script setup lang="ts">

import { api } from '@/api';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router'

const route = useRoute();

const playlistId = computed(() => Number(route.query.id) || 0);

const playlistName = ref('');
const tracks = ref<Track[]>([]);

const fetchPlaylistDetail = async () => {
    const id: number = playlistId.value;
    if (!id) return;
    try {
        const data = await api.get<PlaylistDetailRes>("/playlist/detail", { id: id });
        const detail = data.playlist;
        if (detail) {
            playlistName.value = detail.name || "歌单";
            tracks.value = detail.tracks?.map((t) => ({
                id: t.id,
                name: t.name,
                artist: (t.ar || t.artist || []).map((a) => a.name).join("/"),
                durationMs: t.dt || t.duration || 0,
                album: (t.al || t.album.name)?.name || '',
            }));
        }
        console.log(tracks.value);
    } catch(err) {
        console.log("获取歌单列表失败", err);
    }
}

onMounted(() => {
    void Promise.allSettled([fetchPlaylistDetail()]);
});

</script>

<template>
    歌曲列表
</template>

<style>

</style>