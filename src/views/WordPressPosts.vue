<template>
  <div>
    <WordPressMenubar />
    <h1>WordPress Posts</h1>
    <div class="grid">
      <div v-for="post in paginatedPosts" :key="post.id" class="col-12 md:col-6 lg:col-4 flex">
        <Card class="flex-1 flex justify-content-center">
          <template #header>
            <img v-if="post._embedded?.['wp:featuredmedia']?.[0]?.source_url"
                 :src="post._embedded['wp:featuredmedia'][0].source_url"
                 alt="Featured Image"
                 style="width: 100%; height: auto;" />
          </template>
          <template #title>
            {{ post.title.rendered }}
          </template>
          <template #content>
            <div v-html="post.excerpt.rendered"></div>
            <router-link :to="{ path: `/post/${post.slug}` }" class="p-button p-button-primary mt-2">Read more</router-link>
          </template>
        </Card>
      </div>
    </div>
    <Paginator 
      v-if="posts.length > 0" 
      :first="first" 
      :rows="rows" 
      :totalRecords="posts.length" 
      @page="onPageChange" 
    />
    <div v-if="newPosts.length > 0" class="new-posts-notification">
      <h2>New Posts Available:</h2>
      <div class="p-grid">
        <div v-for="post in newPosts" :key="post.id" class="p-col-12 p-md-6 p-lg-4">
          <Card>
            <template #header>
              <img v-if="post._embedded?.['wp:featuredmedia']?.[0]?.source_url"
                   :src="post._embedded['wp:featuredmedia'][0].source_url"
                   alt="Featured Image"
                   style="width: 100%; height: auto;" />
            </template>
            <template #title>
              {{ post.title.rendered }}
            </template>
            <template #content>
              <div v-html="post.excerpt.rendered"></div>
              <router-link :to="{ path: `/post/${post.slug}` }" class="p-button p-button-primary mt-2">Read more</router-link>
            </template>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { getPosts } from '../services/wordpress';
import Card from 'primevue/card';
import Paginator from 'primevue/paginator';
import WordPressMenubar from '../components/WordPressMenubar.vue';

export default {
  name: 'WordPressPosts',
  components: {
    Card,
    Paginator,
    WordPressMenubar,
  },
  setup() {
    const posts = ref([]);
    const newPosts = ref([]);
    const first = ref(0);
    const rows = ref(3); // Number of posts per page
    let pollingInterval = null;

    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getPosts();
        console.log('Fetched Posts:', fetchedPosts);
        posts.value = fetchedPosts;
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    const startPolling = () => {
      pollingInterval = setInterval(fetchPosts, 30000); // Poll every 30 seconds
    };

    const onPageChange = (event) => {
      first.value = event.first;
      rows.value = event.rows;
    };

    const paginatedPosts = computed(() => {
      const start = first.value;
      const end = first.value + rows.value;
      return posts.value.slice(start, end);
    });

    onMounted(() => {
      fetchPosts();
      startPolling();
    });

    onUnmounted(() => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    });

    return { posts, newPosts, fetchPosts, first, rows, paginatedPosts, onPageChange };
  },
};
</script>

<style scoped>
.new-posts-notification {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
}
</style>
