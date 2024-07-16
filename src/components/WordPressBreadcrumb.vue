<template>
  <div class="card flex justify-center">
    <Breadcrumb :home="home" :model="items">
      <template #item="{ item, props }">
        <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
          <a :href="href" v-bind="props.action" @click="navigate">
            <span :class="[item.icon, 'text-color']"></span>
            <span class="text-primary font-semibold">{{ item.label }}</span>
          </a>
        </router-link>
        <a v-else :href="item.url" :target="item.target" v-bind="props.action">
          <span class="text-surface-700 dark:text-surface-0">{{ item.label }}</span>
        </a>
      </template>
    </Breadcrumb>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Breadcrumb from 'primevue/breadcrumb';

const home = ref({
  icon: 'pi pi-home',
  route: { name: 'Home' }
});

const items = ref([]);

const route = useRoute();
const router = useRouter();

const updateBreadcrumb = () => {
  const breadcrumbItems = [{ label: 'Home', route: { name: 'Home' } }];

  if (route.name === 'PostDetail') {
    breadcrumbItems.push(
      { label: 'Posts', route: { name: 'Posts' } },
      { label: route.params.slug, route: { name: 'PostDetail', params: { slug: route.params.slug } } }
    );
  } else if (route.name === 'Posts') {
    breadcrumbItems.push({ label: 'Posts', route: { name: 'Posts' } });
  }

  items.value = breadcrumbItems;
};

onMounted(updateBreadcrumb);
watch(() => route.name, updateBreadcrumb);
watch(() => route.params.slug, updateBreadcrumb);
</script>

<style scoped>
/* Add any necessary scoped styles here */
</style>
