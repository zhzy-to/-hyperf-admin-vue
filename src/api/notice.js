import { post , get } from '~/utils/request'

export function getNoticeList(page){
    return get(`/admin/notice/${page}`)
}

export function createNotice(data){
    return post("/admin/notice",data)
}

export function updateNotice(id,data){
    return post("/admin/notice/"+id,data)
}

export function deleteNotice(id){
    return post(`/admin/notice/${id}/delete`)
}
