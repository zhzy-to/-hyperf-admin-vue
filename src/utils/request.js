import axios from "axios";
import {getToken} from "~/utils/auth";
import { ElMessageBox } from 'element-plus'
import {toast} from "~/utils/toast.js";
import store from "~/store/index.js";


// 创建实例
const instance = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_URL,
    timeout: 5000,
    // 使用自定义header 注意后端跨域设置
    headers: {'X-Custom-Header': 'zzy'}
});

instance.defaults.headers.post['Content-Type'] = 'application/json';

/**
 * 定义异常响应
 * @param error
 * @returns {Promise<never>}
 */
const errorHandler = error => {

    console.log('请求异常',error)

    // eslint-disable-next-line no-empty
    if (error.response) {

    }
    toast('请求异常, 请稍后重试...','error')

    return Promise.reject(error)
}

/**
 * 在实例上添加请求拦截 有两个实参  onFulfilled  onRejected
 */
instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    const token = getToken()
    if (token) config.headers['Authorization'] = `Bearer ${token}`

    return config;

}, errorHandler);

// 响应拦截
instance.interceptors.response.use((response) => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.hasOwnProperty('code') && res.code !== 20000) {

        toast(res.message,'error')

        if (res.code === 50008) {
            // to re-login
            store.dispatch('logout').then(() => {
                location.reload()
            })
        }
        // 返回响应错误信息
        return Promise.reject(new Error(res.message || 'Error'))
    } else {
        return res.data
    }

},errorHandler);

/**
 * get 请求
 * @param url
 * @param data
 * @param options
 * @returns {AxiosPromise}
 */
export const get = (url, data = {}, options = {}) => {
    return instance({
        url,
        params: data,
        method: 'get',
        ...options,
    });
}


export const post = (url, data = {}, options = {}) => {
    return instance({
        url,
        data: data,
        method: 'post',
        ...options,
    });
}

export const put = (url, data = {}, options = {}) => {
    return instance({
        url,
        data: data,
        method: 'put',
        ...options,
    });
}

export const del = (url, data = {}, options = {}) => {
    return instance({
        url,
        data: data,
        method: 'delete',
        ...options,
    });
}
