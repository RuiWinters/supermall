import { debounce } from "./utils";
import {BACK_POSITION} from "common/const"
import BackTop from 'components/content/backTop/BackTop'

export const imgListenerMixin = {
  data() {
    return {
      // 监听图片
      itemImgListener: null
    }
  },

  mounted() {
    // 给防抖函数赋值一个新的函数
    const refresh = debounce(this.$refs.scroll.refresh, 50);

    // 接收发射的事件总线,并用监听图片变量保存
    this.itemImgListener = () => {
      refresh();
    };
    this.$bus.$on("itemImageLoad", this.itemImgListener);
  }
};

export const backTopMixin = {
  data() {
    return {
      isShowBackTop:false
    };
  },
  components:{
    BackTop
  },
  methods: {
    // 回到顶部
    backTop() {
      // 调用子组件里面封装的scrollTo方法即可
      this.$refs.scroll.scrollTo(0, 0);
    },
    listenShowBackTop(position){
      this.isShowBackTop = (-position.y)>BACK_POSITION
    }
  }
};
