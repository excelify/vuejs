<template>
  <div class="card">
    <Menubar :model="menuItems">
      <template #item="{ item, props, hasSubmenu }">
        <router-link v-if="item.to" :to="item.to" v-bind="props.action">
          <span :class="item.icon"></span>
          <span class="ml-2">{{ item.label }}</span>
          <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down ml-2"></span>
        </router-link>
        <a v-else :href="item.url" :target="item.target" v-bind="props.action">
          <span :class="item.icon"></span>
          <span class="ml-2">{{ item.label }}</span>
          <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down ml-2"></span>
        </a>
      </template>
    </Menubar>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { getPosts } from '../services/wordpress';
import Menubar from 'primevue/menubar';
import { useRouter } from 'vue-router';

const router = useRouter();
const menuItems = ref([]);

const fetchPosts = async () => {
  try {
    const posts = await getPosts();
    menuItems.value = posts.map(post => ({
      label: post.title.rendered,
      // Ensure correct path to navigate to PostDetail.vue using slug
      to: {
        name: 'PostDetail', // Vue Router's named route for PostDetail.vue
        params: { slug: post.slug }, // Params object with slug
      },
    }));
  } catch (error) {
    console.error('Error fetching posts for menubar:', error);
  }
};

// Fetch posts when the component is mounted
onMounted(fetchPosts);

// Watch for route changes and fetch posts again to refresh content
watch(() => router.currentRoute.value, (to, from) => {
  if (to.name === 'PostDetail' && to.params.slug !== from.params.slug) {
    fetchPosts();
  }
});
</script>

<style scoped>
/* Add any necessary scoped styles here */
</style>
