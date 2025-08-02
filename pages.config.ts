import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'

export default defineUniPages({
  globalStyle: {
    navigationBarTextStyle: 'white',
    navigationBarTitleText: '电竞馆',
    navigationBarBackgroundColor: '#1a1a1a',
    backgroundColor: '#1a1a1a',
    navigationStyle: 'custom', // 自定义导航栏
  },
  pages: [
    {
      name: 'index',
      path: 'pages/index/index',
      style: {
        navigationBarTitleText: '门店',
        enablePullDownRefresh: false,
      },
    },
    {
      name: 'search',
      path: 'pages/search/search',
      style: {
        navigationBarTitleText: '查询',
        enablePullDownRefresh: false,
      },
    },
    {
      name: 'profile',
      path: 'pages/profile/profile',
      style: {
        navigationBarTitleText: '我的',
        enablePullDownRefresh: false,
      },
    },
  ],
  tabBar: {
    color: '#cccccc',
    selectedColor: '#ff0000',
    backgroundColor: '#1a1a1a',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        iconPath: 'static/tabbar/store.png',
        selectedIconPath: 'static/tabbar/store-active.png',
        text: '门店',
      },
      {
        pagePath: 'pages/search/search',
        iconPath: 'static/tabbar/search.png',
        selectedIconPath: 'static/tabbar/search-active.png',
        text: '查询',
      },
      {
        pagePath: 'pages/profile/profile',
        iconPath: 'static/tabbar/profile.png',
        selectedIconPath: 'static/tabbar/profile-active.png',
        text: '我的',
      },
    ],
  },
})