import axios from 'axios';
function getBaseURL() {
    if (typeof window !== 'undefined') {
        // Allow runtime override via global variable
        const win = window;
        if (typeof win.__PSP_API_BASE_URL__ === 'string') {
            return win.__PSP_API_BASE_URL__;
        }
    }
    return '';
}
export const apiClient = axios.create({
    baseURL: getBaseURL(),
    timeout: 30_000,
    headers: {
        'Content-Type': 'application/json',
    },
});
// Request interceptor — attach auth token
apiClient.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined'
        ? localStorage.getItem('psp_access_token')
        : null;
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));
// Response interceptor — handle 401, refresh token, etc.
apiClient.interceptors.response.use((response) => response, async (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || '';
    // 排除登录相关接口的 401 处理（登录失败不应跳转，应显示错误提示）
    const isAuthEndpoint = /\/api\/v1\/auth\/(login|mfa|refresh)/.test(requestUrl);
    if (status === 401 && !isAuthEndpoint) {
        // Clear token and redirect to login
        if (typeof window !== 'undefined') {
            localStorage.removeItem('psp_access_token');
            localStorage.removeItem('psp_refresh_token');
            window.location.href = '/login';
        }
    }
    return Promise.reject(error);
});
//# sourceMappingURL=client.js.map