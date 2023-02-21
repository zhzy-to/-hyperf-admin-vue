/**
 *  vuex 状态管理
 */
import { createStore } from 'vuex'
import { getInfo as apiGetInfo, login as apiLogin } from "~/api/manager.js";
import { removeToken, setToken } from "~/utils/auth.js";

const store = createStore({
    getters: {
        id: state => state.user.id,
        avatar: state => state.user.avatar,
        username: state => state.user.username,
        menus: state => state.menus,
    },
    state () {
        return {
            // 用户信息
            user: {},

            // 侧边栏宽度
            asideWidth: "250px",

            menus: [],

            ruleNames: [],
        }
    },
    mutations: {
        SET_USERINFO(state,data) {
            state.user = data
            //Object.assign(state, getDefaultState())
        },

        SET_MENUS(state,data) {
            state.menus = data
        },

        SET_RULE_NAMES(state,data) {
            state.ruleNames = data
        },

        // 展开收起
        handleAsideWidth(state) {
            state.asideWidth = state.asideWidth == '250px' ? '64px' : '250px'
        }
    },
    actions: {
        login({ commit }, data) {
            return new Promise((resolve,reject) => {
                apiLogin(data).then(res => {
                    setToken(res.token)
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 获取当前登录用户信息
        // 解构参数
        getInfo({ commit }) {
            return new Promise((resolve,reject) => {
                apiGetInfo().then(res => {
                    commit('SET_USERINFO',res.user)
                    commit('SET_MENUS',res.routers)
                    commit('SET_RULE_NAMES',res.ruleNames)
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })

        },

        logout({ commit }) {
            removeToken()
            commit('SET_USERINFO',{})
        },
    }
})

export default store
