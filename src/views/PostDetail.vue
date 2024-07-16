<template>
  <div>
    <WordPressMenubar />
    <Breadcrumb :model="breadcrumbItems" home="home" />
    <div v-if="post">
      <h1>{{ post.title.rendered }}</h1>
      <div v-if="featuredImage">
        <img :src="featuredImage.source_url" :alt="post.title.rendered" />
      </div>
      <div v-else>
        <!-- If there's no featured image, display an alternative message or placeholder -->
        <p>No featured image available.</p>
      </div>
      <div v-html="post.content.rendered"></div>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import WordPressMenubar from '../components/WordPressMenubar.vue';
import Breadcrumb from 'primevue/breadcrumb';

export default {
  name: 'PostDetail',
  components: {
    WordPressMenubar,
    Breadcrumb,
  },
  setup() {
    const route = useRoute();
    const post = ref(null);
    const featuredImage = ref(null);
    const breadcrumbItems = ref([
      { label: 'Home', to: '/' },
      { label: 'Posts', to: '/posts' },
      { label: route.params.slug }
    ]);

    const fetchPost = async () => {
      try {
        const response = await axios.get(`https://app.hostexcelify.com/wp-json/wp/v2/posts?slug=${route.params.slug}`);
        if (response.data.length > 0) {
          post.value = response.data[0];
          if (post.value.featured_media) {
            fetchFeaturedImage(post.value.featured_media);
          } else {
            // Reset featuredImage ref if no featured_media found
            featuredImage.value = null;
          }
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    const fetchFeaturedImage = async (mediaId) => {
      try {
        const response = await axios.get(`https://app.hostexcelify.com/wp-json/wp/v2/media/${mediaId}`);
        featuredImage.value = response.data;
      } catch (error) {
        console.error('Error fetching featured image:', error);
      }
    };

    onMounted(fetchPost);

    // Watch for changes in the route's slug param and refetch the post data
    watch(() => route.params.slug, fetchPost);

    return { post, featuredImage, breadcrumbItems };
  },
};
</script>

<style scoped>
img {
  max-width: 100%;
  height: auto;
  margin-bottom: 20px;
}
</style>
