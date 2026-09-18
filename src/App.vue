<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useUserStore } from './stores/user';
import { api } from './api';

const userStore = useUserStore();

const router = useRouter();

const handleAvatarClick = () => {

}

const handleLogOut = async () => {
  try {
      const data = await api.get<LogoutRes>("/logout" , {
      withCredentials: true,
      cookie: userStore.cookie,
    });
    if (data.code === 200) {
      userStore.clearUser();
      router.push("/");
    }
  } catch(err) {
    console.log("退出登录失败", err);
  }
}

const searchKeyword = ref('')
const handleSearch = () => {
  const keyword = searchKeyword.value.trim();
  router.push({
    name: 'search',
    query: {keyword},
  })
}
</script>

<template>
  <div class="app">
    <header class="top-nav">
      <div class="top-nav-inner">
        <div class="logo">
          <a href="#/">网易云音乐</a>
        </div>
        <nav class="nav-links">
          <RouterLink to="/" class="nav-link">音乐馆</RouterLink>
          <RouterLink to="/MyMusic" class="nav-link">我的音乐</RouterLink>
        </nav>
        <div class="nav-actions">
          <div class="search-box">
            <input 
            id="1"
            type="text" 
            class="search-input" 
            placeholder="搜索歌曲/歌手/专辑" 
            v-model="searchKeyword"
            @keyup.enter="handleSearch"
            >
          </div>
          <RouterLink to="/login" class="login-btn" v-if="!userStore.isLoggedIn">登录</RouterLink>
          <div class="user-menu" v-else>
            <button class="user-avatar" type="button" @click="handleAvatarClick">
              <img :src="userStore.user?.avatar" alt="用户头像">
            </button>
            <div class="user-dropdown">
              <div class="user-dropdown-header">
                <span class="user-name">{{ userStore.user?.nickname || "我的账号"}}</span>
              </div>
              <button class="user-dropdown-item" type="button" @click="handleLogOut">退出登录</button>
            </div>
          </div>
        </div>
      </div>
    </header>
    <main class="main-view">
      <RouterView/>
    </main>
  </div>
</template>

<style scoped>

.app{
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  background-color: #f5f7fb;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.top-nav{
  display: flex;
  height: 90px;
  align-items: center;
  justify-content: center;
  background-color: #242424;
  color: #333;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.top-nav-inner{
  display: flex;
  max-width: 1200px;
  width: 100%;
  padding: 0 32px;
  align-items: center;
  justify-content: flex-start;
}

.logo{
  background-image: url(./assets/imgs/topbar.png);
  float: left;
  width: 176px;
  height: 69px;
  background-position: 0 0;
  border: none;
}

.logo a{
  float: left;
  width: 157px;
  height: 100%;
  padding-right: 20px;
  text-indent: -9999px;
}

.nav-links{
  display: flex;
  gap: 24px;
  margin-left: 24px;
}

.nav-link{
  color: #e5e5e5;
  text-decoration: none;
  font-size: 16px;
  padding: 8px 16px;
  border-radius: 18px;
  transition: all 0.2s;
}

.nav-link:hover{
  background-color: #df1515;
}

.nav-actions{
  margin-left: auto;
  align-items: center;
  float: right;
  display: flex;
}

.search-input{
  width: 180px;
  height: 32px;
  padding: 0 12px;
  border-radius: 16px;
  border: none;
  outline: none;
  background-color: #fff;
  font-size: 16px;
}

.search-box{  
  justify-content: right;
}

.login-btn{
  padding: 6px 16px;
  margin: 1em;
  border-radius: 9999px;
  border: 1px solid #c71313;
  color: #c71313;
  font-size: 16px;
  text-decoration: none;
  transition: all 0.2s;
}

.login-btn:hover{
  background-color: #c71313;
  color: #f5f7fb;
}

.main-view{
  flex: 1;
}

.user-menu {
  margin-top: 10px;
  margin-left: 24px;
  position: relative;
}

.user-avatar {
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  padding: 0;
  border: none;
  outline: none;
  background: transparent;
  cursor: pointer;
  overflow: hidden;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 50%;
}

.user-dropdown {
  position: absolute;
  top: 36px;
  right: 0;
  min-width: 140px;
  padding: 8px 0;
  border-radius: 8px;
  background: #2d2d2d;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
  opacity: 0;
  pointer-events: none;
  transform: translateY(4px);
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.user-dropdown-header {
  padding: 4px 14px 6px;
  border-bottom: 1px solid rgba(255, 355, 255, 0.08);
  margin-bottom: 4px;
}

.user-name {
  font-size: 12px;
  color: #f5f5f5;
}

.user-dropdown-item {
  width: 100%;
  padding: 6px 14px;
  border: none;
  background: transparent;
  color: #f5f7fb;
  font-size: 12px;
  text-align: left;
  cursor: pointer;
}

.user-dropdown-item:hover {
  background: rgba(255, 255, 255, 0.06);
}

.user-menu:hover .user-dropdown {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}

</style>