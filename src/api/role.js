import {post, get, put, del} from '~/utils/request'

// 角色列表
export function getRoleList(page = 1,query = {
    pageSize: 10,
    name: '',
}) {
    let q = []
    for (const key in query) {
        if (query[key]) {
            q.push(`${key}=${encodeURIComponent(query[key])}`)
        }
    }
    let r = q.join("&")
    r = r ? ("&" + r) : ''
    return get(`/role/roleList?page=${page}${r}`);
}

// 新增角色
export function createRole(data) {
    return post("/role/create",data);
}

// 更新角色
export function updateRole(data) {
    return put(`/role/update/${data.id}`,data);
}

// 设置菜单权限
export function setRules(id,data) {
    return post(`/role/setRules/${id}`,data)
}

// 删除
export function delRole(id) {
    return del(`/role/delete/${id}`);
}
