import { createRouter, createWebHashHistory } from 'vue-router'
// import Layout from '@/layout/index.vue'
// import Home from '@/views/home/Home.vue'
import Home from '../components/HelloWorld.vue'
import List from '../components/list.vue'
import Add from '../components/add.vue'
import detail from '../components/detail.vue'
const routes = [
  {
    path: '/',
    component: Add
    // component: Layout,
    // children: [{ path: '', component: Home }],
  },
  // {
  //   path: '/list',
  //   component: List
  //   // component: Layout,
  //   // children: [{ path: '', component: Home }],
  // },
  {
    path: '/add',
    component: Add
    // component: Layout,
    // children: [{ path: '', component: Home }],
  },
  {
    path: '/detail',
    component: detail
    // component: Layout,
    // children: [{ path: '', component: Home }],
  },
]

export default createRouter({
history: createWebHashHistory(),
routes,
})
