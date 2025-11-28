<template>
  <div class="min-h-screen flex flex-col">
    <SiteHeader />

    <main class="flex-1 py-6 md:py-10 px-4">
      <div
        class="mx-auto w-full content-wrapper"
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

<style>
.content-wrapper p {
  margin-top: 1rem;
  margin-bottom: 1rem;
  color: var(--fg);
}

.content-wrapper a {
  color: var(--link);
  text-decoration: none;
}

.content-wrapper a:hover {
  text-decoration: underline;
}

.content-wrapper h1,
.content-wrapper h2,
.content-wrapper h3 {
  color: var(--fg);
}

.content-wrapper ul li {
  margin-top: .5rem;
  margin-bottom: .5rem;
}
</style>
