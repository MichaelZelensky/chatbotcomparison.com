<template>
  <div class="min-h-screen flex flex-col">
    <SiteHeader />
    <main class="container flex-1 py-8">
      <NuxtPage />
    </main>
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import SiteHeader from '~/components/SiteHeader.vue';
import SiteFooter from '~/components/SiteFooter.vue';
</script>
