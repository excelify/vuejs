// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';
import WordPressPosts from '../views/WordPressPosts.vue';
import PostDetail from '../views/PostDetail.vue';
import WordPressSearch from '../views/WordPressSearch.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: WordPressPosts,
  },
  {
    path: '/post/:slug',
    name: 'PostDetail',
    component: PostDetail,
    props: true,
  },
  {
    path: '/search',
    name: 'WordPressSearch',
    component: WordPressSearch,
  },
  // Add more routes as needed
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
