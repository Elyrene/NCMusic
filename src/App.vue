<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router'

const searchKeyword = ref('')
const handleSearch = () => {
  const keyword = searchKeyword.value.trim();
  console.log(keyword);
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
          <RouterLink to="/login" class="login-btn">登录</RouterLink>
        </div>
      </div>
    </header>
    <main class="main-view">
      <RouterView/>
    </main>
  </div>
</template>
<style>

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
  width: 70%;
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

</style>