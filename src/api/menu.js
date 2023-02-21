import {post, get, put, del} from '~/utils/request'

// 权限菜单列表
export function getMenuList() {
    return get('/menu/menuList')
}

// 创建菜单权限
export function createMenu(data) {
    if (data.parent_id === '' || data.parent_id === null) {
        data.parent_id = 0
    }

    return post('/menu/create',data)
}

// 更新菜单
export function updateMenu(data) {
    if (data.parent_id === '' || data.parent_id === null) {
        data.parent_id = 0
    }
    return put(`/menu/update/${data.id}`,data)
}

// 更改状态
export function updateMenuStatus(data) {
    return post(`/menu/updateStatus/${data.id}`,data)
}

// 删除
export function deleteMenu(id) {
    return del(`/menu/delete/${id}`);
}

