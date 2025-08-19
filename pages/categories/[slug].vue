<template>
  <UiContainer>
    <section class="py-10">
      <h1 class="text-3xl font-bold capitalize">{{ (route.params.slug as string).replace('-', ' ') }}</h1>
      <p class="mt-2 text-zinc-700">Filtered table and description of this niche (stub).</p>
      <div class="mt-6 card">
        <p>Table placeholder …</p>
      </div>
    </section>
  </UiContainer>
</template>
<script setup lang="ts">
import UiContainer from '@/components/UiContainer.vue'
const route = useRoute()
</script>