<template>
  <div class="min-h-screen flex flex-col">
    <SiteHeader />
    <main class="flex-1 py-6 md:py-8 px-4 md:px-8">
      <NuxtPage />
    </main>
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import SiteHeader from '~/components/SiteHeader.vue';
import SiteFooter from '~/components/SiteFooter.vue';
</script>
