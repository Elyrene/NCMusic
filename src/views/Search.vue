<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute(); 

const searchKeyWord = computed(() => String(route.query.keyword) || '')

onMounted(() => {
    console.log(searchKeyWord.value);
})
</script>

<template>
    搜索
</template>

<style scoped>
</style>