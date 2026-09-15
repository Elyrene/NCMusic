<script setup lang="ts">
import { api } from '@/api';
import { useUserStore } from '@/stores/user';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const loginKey = ref<string>('');
const qrImg = ref<string>('');

const qrCheckTimer = ref<number | null>(null);

const userStore = useUserStore();

const fetchloginKey = async () => {
    try {
        const data = await api.get<LoginQrKeyRes>("/login/qr/key");
        loginKey.value = data.data?.unikey || '';
        // console.log(loginKey.value);
    } catch(err) {
        console.log("获取二维码 Key 失败", err);
        loginKey.value = '';
    }
}

const fetchQrImg = async (key: string) => {
    if (!key) return;
    try {
        const data = await api.get<LoginQrCreateRes>("/login/qr/create",{
            key,
            timeStamp: Date.now(),
            ua: "pc",
            qrimg: true,
        });
        qrImg.value = data.data?.qrimg || '';
        // console.log(qrImg.value);
    } catch(err) {
        console.log("获取二维码图片失败", err);
        qrImg.value = '';
    }
}

// 监听获取到 key 就获取二维码

watch(() => loginKey.value, (val: string) => {
    if (val) {
        fetchQrImg(val);
    }
})

// 轮询监听是否扫描二维码

const startQrCheak = (key: string) => {
    if (!key) return;
    if (qrCheckTimer.value) {
        clearInterval(qrCheckTimer.value);
    }
    qrCheckTimer.value = setInterval(async () => {
        try {
            const data = await api.get<LoginQrCheckRes>("/login/qr/check", {
                key,
                timeStamp: Date.now(),
                ua: "pc",
            })
            // console.log(data);
            if (data.code === 803) {
                if (qrCheckTimer.value) clearInterval(qrCheckTimer.value);
                qrCheckTimer.value = null;
                userStore.setCookie(data.cookie);
                try {
                    const statusRes = await api.get<LoginStatusRes>("/login/status", {
                        timeStamp: Date.now(),
                        ua: "pc",
                        cookie: userStore.cookie,
                    })
                    // console.log(statusRes);
                    const profile = statusRes.data?.profile;
                    // console.log(profile);
                    if (profile) {
                        userStore.setUser({
                            id: profile.userId,
                            avatar: profile.avatarUrl,
                            nickname: profile.nickname,
                        })
                    }
                    router.push('/');
                } catch (err) {
                    console.log("获取登录状态失败", err);
                }
            } else if(data.code === 800) {
                // console.log('二维码过期');
                if (qrCheckTimer.value) clearInterval(qrCheckTimer.value);
                qrCheckTimer.value = null;
                fetchloginKey();
            }
        } catch (err) {
            console.log("检查二维码登录状态失败", err);
        }
    }, 3000)
}

watch(() => qrImg.value, (val: string) => {
    if (val && loginKey.value) {
        startQrCheak(loginKey.value);
    } 
})

const handleOverlayClick = (event: MouseEvent) => {
    if (event.target === event.currentTarget) {
        router.push('/')
    }
}

onMounted(() => {
    fetchloginKey(); 
})

onBeforeUnmount(() => {
    if (qrCheckTimer.value) {
        clearInterval(qrCheckTimer.value);
        qrCheckTimer.value = null;
    }
})

</script>

<template>
    <div class="login-overlay" @click="handleOverlayClick">
        <div class="login-modal">
            <div class="login-header">
                <h2>扫码登录网易云音乐</h2>
                <p>使用网易云 App 扫码登录: 更安全更快捷</p>
            </div>
            <div class="login-body">
                <div class="qrcode-box">
                    <div class="qrcode-placeholder">
                        <template v-if="qrImg">
                            <img :src="qrImg" alt="登录二维码">
                        </template>
                        <template v-else>
                            <span>二维码加载中...</span>
                        </template>
                    </div>
                    <p class="qrcode-tip">打开网易云音乐 App，扫一扫登录</p>
                </div>
                <ul class="login-features">
                    <li>同步收藏的歌单、歌曲和播放记录</li>
                    <li>多端同步，随时随地畅听音乐</li>
                    <li>更安全的扫码登录方式</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style scoped>

.login-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
}

.login-modal {
    width: 420px;
    padding: 24px 32px 32px;
    border-radius: 8px;
    background: #ffffff;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    box-sizing: border-box;
}

.login-header h2 {
    margin: 0;
    font-size: 20px;
    color: #333;
}

.login-header p {
    margin: 8px 0 0;
    font-size: 13px;
    color: #666;
}

.login-body {
    margin-top: 20px;
    display: flex;
    gap: 20px;
}

.qrcode-box {
    text-align: center;
}

.qrcode-placeholder {
    width: 140px;
    height: 140px;
    border-radius: 4px;
    background: #f5f5f5;
    border: 1px solid #e1e1e1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    font-size: 14px;
}

.qrcode-placeholder img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.qrcode-tip {
    margin-top: 8px;
    font-size: 12px;
    color: #666;
}

.login-features {
    list-style: none;
    padding: 0;
    margin: 0;
    font-size: 13px;
    color: #555;
}

.login-features li + li{
    margin-top: 8px;
}

</style>