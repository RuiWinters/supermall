<template>
    <div id="detail">
        <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref ="nav"></detail-nav-bar>
        <scroll class="content" ref="scroll" @scroll="contentScroll" :probe-type="3">
            <detail-swiper :top-images="topImages"></detail-swiper>
            <detail-base-info :goods="goods"/>
            <detail-shop-info :shop="shop"></detail-shop-info>
            <detail-images-info :images-info="detailInfo" @imgLoad="imageLoad"></detail-images-info>
            <detail-param-info ref = "params" :param-info="paramInfo"></detail-param-info>
            <detail-comment-info ref="comment" :comment-info="commentInfo"/>
            <goods-list ref="recommend" :goods="recommends"></goods-list>
        </scroll>
        <back-top @click.native="backTop" v-show="isShowBackTop"></back-top>
        <detail-bottom-bar @addToCart="addToCart"></detail-bottom-bar>
        <!-- <toast :message="123"/> -->
    </div>
</template>

<script>
    import DetailNavBar from './childComps/DetailNavBar'
    import DetailSwiper from './childComps/DetailSwiper'
    import DetailBaseInfo from './childComps/DetailBaseInfo'
    import DetailShopInfo from './childComps/DetailShopInfo'
    import DetailImagesInfo from './childComps/DetailImagesInfo'
    import DetailParamInfo from './childComps/DetailParamInfo'
    import DetailCommentInfo from './childComps/DetailCommentInfo'
    import DetailBottomBar from './childComps/DetailBottomBar'

    import Scroll from 'components/common/scroll/Scroll'
    import GoodsList from 'components/content/goods/GoodsList'
    // import Toast from '../../components/common/toast/Toast'

    import {getDetail,Goods,Shop,GoodsParam,getRecommend} from 'network/detail'
    
    import {imgListenerMixin,backTopMixin} from "common/mixin"
    import {debounce} from "common/utils"
    import {mapActions} from 'vuex'


    export default {
        name:"Detail",
        components:{
            DetailNavBar,
            DetailSwiper,
            DetailBaseInfo,
            DetailShopInfo,
            Scroll,
            DetailImagesInfo,
            DetailParamInfo,
            DetailCommentInfo,
            GoodsList,
            DetailBottomBar,
            // Toast
        },
        mixins:[imgListenerMixin,backTopMixin],
        data(){
            return{
                iid:null,
                topImages:[],
                goods:{},
                shop:{},
                detailInfo:{},
                paramInfo:{},
                commentInfo:{},
                recommends:[],
                themeTopYs:[],
                getThemeTopY:null,
                currentIndex:0
            }
        },
        created(){
            // 1 保存传入的iid
            this.iid = this.$route.params.id

            // 2 根据iid请求详情数据
            getDetail(this.iid).then(res=>{
                // console.log(res)
                // 1 获取顶部的图片轮播数据
                const data = res.result
                this.topImages = data.itemInfo.topImages
                // 2 获取商品信息
                this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)

                // 3 创建店铺信息
                this.shop = new Shop(data.shopInfo)

                // 4 保存商品的详情数据
                this.detailInfo = data.detailInfo

                // 5 获取参数的信息
                this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)

                // 6 获取评论信息
                if(data.rate.cRate!==0)
                {
                    this.commentInfo = data.rate.list[0]
                }
            })

            // 3 请求推荐数据
            getRecommend().then(res=>{
                // console.log(res)
                this.recommends = res.data.list
            })

            // 4 给getThemeTopY赋值
            this.getThemeTopY = debounce(()=>{
                this.themeTopYs = []
                this.themeTopYs.push(0)
                this.themeTopYs.push(this.$refs.params.$el.offsetTop)
                this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
                this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
                this.themeTopYs.push(Number.MAX_VALUE)
            },100)

        },
        destroyed(){
            this.$bus.$off("itemImageLoad",this.itemImgListener)
        },
        methods:{
            // 把addCart方法映射到methods里，就可以直接用addCart了
            ...mapActions(['addCart']),

            imageLoad(){
                this.$refs.scroll.refresh()
                this.getThemeTopY()
            },
            titleClick(index){
                // console.log(index)
                this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],100)
            },
            //导航条和scroll联动
            contentScroll(position){

                // 位置为负值，所以要加负号
                const positionY = -position.y

                //length长度为4——商品、参数、评论、推荐
                let length = this.themeTopYs.length

                if(this.currentIndex!=this.$refs.nav.currentIndex)
                {

                    this.currentIndex = this.$refs.nav.currentIndex
                }
                //num随机变化，范围是0-400
                //已知数组[0,100,200,300]
                //应该把num插入到哪个位置，使数组仍然是升序的
                for(let i = 0;i<length-1;i++){
                    if(this.currentIndex!==i && (positionY>=this.themeTopYs[i] && positionY<this.themeTopYs[i+1])){
                        this.currentIndex = i
                        this.$refs.nav.currentIndex = this.currentIndex
                    }
                }

                // 是否显示回到顶部
                // this.isShowBackTop = -position.y > BACK_POSITION
                this.listenShowBackTop(position)
            },
            addToCart(){
                // 1 获取购物车需要展示的信息
                const product = {}
                product.image = this.topImages[0]
                product.title = this.goods.title
                product.desc = this.goods.desc
                product.price = this.goods.realPrice
                product.iid = this.iid

                // 2 将商品添加到购物车里
                // this.$store.cartList.push(product)
                // this.$store.commit('addCart',product)
                // this.$store.dispatch('addCart',product)              
                this.addCart(product).then(res=>{
                    // console.log(res)
                    this.$toast.show(res)//显示添加成功
                })
            }
        }
    }
</script>

<style scoped>
    #detail{
        position: relative;
        z-index: 9;
        background-color: #fff;
        height: 100vh;
    }
    .detail-nav{
        position: relative;
        z-index: 9;
        background-color: #fff;
    }
    .content{
        height: calc(100% - 44px - 58px);
    }
</style>