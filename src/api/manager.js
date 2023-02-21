import {post, get, put} from '~/utils/request'

// 登录
export function login(data) {
    return post('/admin_user/login',data)
}

// 获取登录者信息
export function getInfo() {
    return post('/admin_user/getInfo')
}

// 退出登录
export function logout() {
    return post('/admin_user/logout')
}

// 修改密码
export function rePassword(data) {
    return post('/admin_user/updatepassword',data)
}

// 管理员列表
export function getManagerList(page = 1, query = {
    pageSize: 10,
    name: '',
    username: '',
}) {
    let q = []
    for (const key in query) {
        if (query[key]) {
            q.push(`${key}=${encodeURIComponent(query[key])}`)
        }
    }
    let r = q.join("&")
    r = r ? ("&" + r) : ''

    return get(`/manager/managerList?page=${page}${r}`)
}

// 创建管理员
export function createManager(attributes) {
    return post('/manager/create',attributes)
}

// 更新管理员
export function updateManager(attributes) {
    return put('/manager/update',attributes)
}

// 获取角色集合
export function getRoles() {
    return get('/role/roles')
}
