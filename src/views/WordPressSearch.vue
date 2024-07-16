<template>
   <div>
     <WordPressMenubar />
     <div class="search-container">
       <InputText v-model="searchQuery" placeholder="Search for posts" @input="filterPosts" />
     </div>
     <div class="results-container">
       <Card v-for="post in filteredPosts" :key="post.id" class="result-card">
         <template #title>
           <router-link :to="{ name: 'PostDetail', params: { slug: post.slug } }">
             {{ post.title.rendered }}
           </router-link>
         </template>
         <template #content>
           <div v-html="post.excerpt.rendered"></div>
         </template>
         <template #footer>
           <small>Published on: {{ new Date(post.date).toLocaleDateString() }}</small>
         </template>
       </Card>
     </div>
   </div>
 </template>
 
 <script>
 import { ref, onMounted } from 'vue';
 import axios from 'axios';
 import WordPressMenubar from '../components/WordPressMenubar.vue';
 import InputText from 'primevue/inputtext';
 import Card from 'primevue/card';
 
 export default {
   name: 'WordPressSearch',
   components: {
     WordPressMenubar,
     InputText,
     Card,
   },
   setup() {
     const searchQuery = ref('');
     const posts = ref([]);
     const filteredPosts = ref([]);
 
     const fetchPosts = async () => {
       try {
         const response = await axios.get('https://app.hostexcelify.com/wp-json/wp/v2/posts');
         posts.value = response.data;
         filteredPosts.value = response.data; // Initialize filteredPosts with all posts
       } catch (error) {
         console.error('Error fetching posts:', error);
       }
     };
 
     const filterPosts = () => {
       if (searchQuery.value) {
         filteredPosts.value = posts.value.filter(post => 
           post.title.rendered.toLowerCase().includes(searchQuery.value.toLowerCase())
         );
       } else {
         filteredPosts.value = posts.value; // Reset to all posts if search query is empty
       }
     };
 
     onMounted(fetchPosts);
 
     return {
       searchQuery,
       posts,
       filteredPosts,
       filterPosts,
     };
   },
 };
 </script>
 
 <style scoped>
 .search-container {
   display: flex;
   justify-content: center;
   margin: 20px 0;
 }
 
 .results-container {
   display: flex;
   flex-wrap: wrap;
   gap: 20px;
   justify-content: center;
 }
 
 .result-card {
   width: 300px;
 }
 </style>
 