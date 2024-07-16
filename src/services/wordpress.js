import axios from 'axios';

const WORDPRESS_API_URL = 'https://app.hostexcelify.com/wp-json/wp/v2';

export const getPosts = async () => {
  try {
    const response = await axios.get(`${WORDPRESS_API_URL}/posts?_embed`);
    console.log('Fetched Posts:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

export const getPost = async (slug) => {
  try {
    const response = await axios.get(`${WORDPRESS_API_URL}/posts?slug=${slug}&_embed`);
    return response.data[0];
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
};
