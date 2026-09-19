<script setup lang="ts">
import { api } from '@/api';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const playerId = computed(() => Number(route.query.id) || 0);

const tracks = ref<Track[]>([]);

const isLoading = ref<boolean>(false);

const fetchSingerSongs = async () => {
    const id = playerId.value;
    try {
        const data = await api.get<ArtistTopSongRes>('/artist/top/song', {id: id});
        tracks.value = data.songs.map((item) => ({
            id: item.id,
            name: item.name,
            artist: (item.ar || item.artist || []).map(a => a.name).join('/'),
            durationMs: item.duration || item.dt || 0,
            album: (item.al || item.album).name || '',
        })) || [];
        console.log(tracks.value);
    } catch (err) {
        console.log('获取歌手热门歌曲失败', err);
    }
}

onMounted(() => {
    fetchSingerSongs();
})

</script>

<template>
    歌手页面
</template>

<style scoped>

</style>