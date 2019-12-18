<template>
  <div class="cart">
    <!-- 导航 -->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{len}})</div>
    </nav-bar>

    <!-- 商品列表 -->
    <cart-list></cart-list>

    <!-- 汇总 -->
    <cart-bottom-bar></cart-bottom-bar>
  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  import CartBottomBar from './childComps/CartBottomBar'

  import CartList from './childComps/CartList'

  //mapGetters辅助函数——将store中的getter映射到局部计算属性
  import {mapGetters} from 'vuex'

  export default {
    name:"Cart",
    components:{
      NavBar,
      CartList,
      CartBottomBar
    },
    computed:{
      // cartLength(){
      //   return this.$store.getters.cartLength
      // }
      // ...mapGetters(['cartLength'])
      ...mapGetters({
        len:'cartLength'
      })
    }
  }
</script>

<style scoped>
  .cart{
    height: 100vh;
  }
  .nav-bar{
    background-color:var(--color-tint);
    color: white;
  }
</style>