<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default  {
    name:  'App',
    metaInfo() {
        return {
            title: this.$store.state.settings.dynamicTitle && this.$store.state.settings.title,
            titleTemplate: title => {
                return title ? `${title} - ${process.env.VUE_APP_TITLE}` : process.env.VUE_APP_TITLE
            }
        }
    },
    created() {
        console.log('aaa')
        //在页面刷新时将vuex里的信息保存到sessionStorage里
        // window.addEventListener("beforeunload",()=>{
        //     // 页面刷新时，JSON序列化会因为 visitedViews 出问题，所以直接赋值
        //     this.$store.state.visitedViews = [{
        //       fullPath: '/userIndex',
        //       hash: '',
        //       meta: {
        //         affix: true,
        //         requireAuth: true,
        //         title: "首页"
        //       },
        //       name: '首页',
        //       path: '/userIndex',
        //       title: '首页'
        //     }];
        // })
    }
}
</script>
