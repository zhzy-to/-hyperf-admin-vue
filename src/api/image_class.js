import { post, get, put, del } from "~/utils/request";

/**
 * 获取素材分类
 * @param page
 * @returns {AxiosPromise}
 */
export function getImageClass(page = 1) {
    return get("/material/classificationList", {
        page: page,
    });
}

/**
 * 创建分类
 * @param data
 * @returns {AxiosPromise}
 */
export function createImageClass(data) {
    return post("/material/createClassification", data);
}

/**
 * 更改分类
 * @param id
 * @param data
 * @returns {AxiosPromise}
 */
export function updateImageClass(id,data) {
    return put("/material/updateClassification/" + id, data);
}

/**
 * 删除分类
 * @param data
 * @returns {AxiosPromise}
 */
export function deleteImageClass(data) {
    return del("/material/deleteClassification", data);
}
