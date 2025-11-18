<template>
  <div class="min-h-screen flex flex-col">
    <SiteHeader />
    <main class="flex-1 py-6 md:py-10 px-4">
      <div
        class="mx-auto w-full"
        style="max-width: 720px;"
      >
        <NuxtPage />
      </div>
    </main>
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import SiteHeader from '~/components/SiteHeader.vue';
import SiteFooter from '~/components/SiteFooter.vue';
</script>
