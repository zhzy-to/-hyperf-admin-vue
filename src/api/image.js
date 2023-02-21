import { get,post,put,del } from "~/utils/request.js";

/**
 * 素材列表
 * @param classId
 * @param data
 * @returns {AxiosPromise}
 */
export function getImageList(classId,data) {
    return get("/material/materialList/" + classId , data);
}

/**
 * 更新图片
 * @param id
 * @param data {{name: string}}
 * @returns {AxiosPromise}
 */
export function updateImage(id,data) {
    return put(`/material/updateMaterial/${id}`,data);
}

/**
 * 删除图片资源
 * @param id
 * @returns {AxiosPromise}
 */
export function deleteImage(id) {
    return del("/material/deleteMaterial", {id:id});
}

export const uploadImageAction = import.meta.env.VITE_APP_BASE_URL + "/material/uploadAndSave";
