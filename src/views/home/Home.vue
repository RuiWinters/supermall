<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control class="tab-control" 
                :titles="['流行','新款','精选']"
                @tabClick="tabClick"
                ref="tabcontrol1"
                v-show="isTabFixed"></tab-control>
    <scroll class="content" 
            ref ="scroll" 
            :probe-type="3" 
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">

        <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
        <recommend-view :recommends="recommends"/>
        <feature-view/>
        <tab-control class="tab-control" 
                    :titles="['流行','新款','精选']"
                    @tabClick="tabClick"
                    ref="tabcontrol2"></tab-control>
        <good-list :goods="showGoods"></good-list>
    </scroll>
    <back-top @click.native="backTop" v-show="isShowBackTop"></back-top>

  </div>
</template>

<script>

  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView'

  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodList from 'components/content/goods/GoodsList'
  import Scroll from 'components/common/scroll/Scroll'
  // import BackTop from 'components/content/backTop/BackTop'

  import {getHomeMultidata,getHomeGoods} from "network/home"
  import {imgListenerMixin,backTopMixin} from "common/mixin"
  // import {BACK_POSITION} from "common/const"

  // import BScroll from 'better-scroll'

  export default {
    name:"Home",
    components:{
      NavBar,
      TabControl,
      GoodList,
      Scroll,
      // BackTop,

      HomeSwiper,
      RecommendView,
      FeatureView   
    },
    mixins:[imgListenerMixin,backTopMixin],
    data(){
      return{
        banners:[],
        recommends:[],
        goods:{
          'pop':{page:0,list:[]},
          'new':{page:0,list:[]},
          'sell':{page:0,list:[]}
        },
        currentType:'pop',
        // isShowBackTop:false,
        tabOffsetTop:0,
        isTabFixed:false,
        // 切换页面时记录位置
        saveY:0,
        // itemImgListener
      }
    },
    computed:{
      showGoods(){
        return this.goods[this.currentType].list
      }
    },
    created(){
      // 1 请求多个数据
      this.getHomeMultidata()
      // 2 请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
    },
    // 以下代码改用mixin技术实现
    // mounted(){
    //   // 3 监听item中图片加载完成——解决BUG：滑动到最下面时，图片还没加载好，显示一半
    //   const refresh = debounce(this.$refs.scroll.refresh,200)
    //   // 对监听的事件进行保存
    //   this.itemImgListener=()=>{

    //   }

    //   this.$bus.$on('itemImageLoad',()=>{
    //     refresh()
    //   })
    // },
    activated(){
      //设置位置
      this.$refs.scroll.scrollTo(0,this.saveY)
      this.$refs.scroll.refresh()
    },
    deactivated(){
      //记录位置
      this.saveY=this.$refs.scroll.getScrollY()
      this.$bus.$off("itemImageLoad",this.itemImgListener)
    },
    methods:{
      
      //事件监听相关的方法
      tabClick(index){
        console.log(index)
        switch(index){
          
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }   
        if(this.$refs.tabcontrol1!==undefined){
          this.$refs.tabcontrol1.currentIndex = index       
          this.$refs.tabcontrol2.currentIndex = index
        }
      },

      // backClick(){
      //   this.$refs.scroll.scrollTo(0,0,500)
      // },

      loadMore(){
        // console.log('上拉加载更多')
        this.getHomeGoods(this.currentType)
        this.$refs.scroll.finishPullUp()
      },

      contentScroll(position){
        // 1 判读backtop是否显示
        // this.isShowBackTop = (-position.y)>BACK_POSITION
        this.listenShowBackTop(position)

        // 2 决定tabcontrol是否吸顶（position：fixed）
        this.isTabFixed = (-position.y)>this.tabOffsetTop
      },

      // 让“流行、新款、精选”往上滚动时能够固定到上面
      swiperImageLoad(){
        // console.log(this.$refs.tabcontrol.$el.offsetTop)
        this.tabOffsetTop = this.$refs.tabcontrol2.$el.offsetTop
      },

      //网络请求相关方法
      getHomeMultidata(){
        getHomeMultidata().then((res)=>{
          // console.log(res)
          this.banners = res.data.banner.list
          this.recommends = res.data.recommend.list
      })
      },
      getHomeGoods(type){
        const page = this.goods[type].page + 1
        getHomeGoods(type,page).then(res=>{
          // console.log(res)
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1
        })
      }
    }
  }
</script>

<style scoped>
  #home{
    padding-top: 44px;
    /* vh 视口 */
    height: 100vh;
    position: relative;
  }
  .home-nav{
    background-color: var(--color-tint);
    color: white;

    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9;
  }
  .tab-control{
    position: relative;
    /* top: 44px; */
    z-index: 9;
  }
  .content{
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
</style>