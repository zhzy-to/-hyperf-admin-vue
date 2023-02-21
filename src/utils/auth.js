import { useCookies } from '@vueuse/integrations/useCookies'

const Cookies = useCookies()
const USER_TOKEN = 'admin_token'

export function getToken() {
    return Cookies.get(USER_TOKEN)
}

export function setToken(token) {
    return Cookies.set(USER_TOKEN, token)
}

export function removeToken() {
    return Cookies.remove(USER_TOKEN)
}
