<template>
  <UiContainer>
    <article class="prose max-w-none py-10">
      <h1 class="mb-2">Vendor: {{ (route.params.slug as string).toUpperCase() }}</h1>
      <p class="text-zinc-700">Overview, key features, pricing, strengths/weaknesses, alternatives (stub).</p>
      <h2>Overview & Context</h2>
      <h2>Key Features</h2>
      <h2>Pricing</h2>
      <h2>Strengths & Weaknesses</h2>
      <h2>Alternatives</h2>
    </article>
  </UiContainer>
</template>
<script setup lang="ts">
import UiContainer from '@/components/UiContainer.vue'
const route = useRoute()
</script>