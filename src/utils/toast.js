import { ElMessage , ElMessageBox, ElNotification  } from 'element-plus'

/**
 * 消息提示
 * @param message
 * @param type
 * @param dangerouslyUseHTMLString
 * @param position
 */
export function toast(message, type = 'success',dangerouslyUseHTMLString = true,position = 'top-right') {
    ElNotification({
        title: type,
        dangerouslyUseHTMLString,
        message: message || 'This is a success message',
        type: type,
        position
    })
}

export function toast2(message, type = 'success', dangerouslyUseHTMLString = false) {
    ElMessage({
        showClose: true,
        dangerouslyUseHTMLString,
        message: message || 'hava an errors',
        type: type,
        duration: 2 * 1000
    })
}

/**
 * 确认框
 * @param content
 * @param type
 * @param title
 * @returns {Promise<MessageBoxData>}
 */
export function showModel(content = '提示内容',type = 'warning',title = '提示') {
    return ElMessageBox.confirm(
        content,
        title,
        {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning',
        }
    )
}

/**
 * 弹出输入框
 */
export function showPrompt(tip, value = '') {
    return ElMessageBox.prompt(tip, '', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputValue: value,
    })
}
