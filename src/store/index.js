import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'


// 1 安装
Vue.use(Vuex)

const state={
    cartList:[]
}

// 2 创建Store对象
const store = new Vuex.Store({
    state,
    //mutations:唯一的目的是修改state中的状态
    //里面的每个方法尽可能完成的事件比较单一
    mutations,
    actions,
    getters
})

// 3 挂载Vue实例上
export default store