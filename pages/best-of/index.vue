<template>
  <UiContainer>
    <section class="py-10">
      <h1 class="text-3xl font-bold">Best‑of Lists</h1>
      <ul class="mt-4 list-disc pl-6">
        <li><NuxtLink to="/best-of/free">Best Free Chatbots</NuxtLink></li>
        <li><NuxtLink to="/best-of/small-business">Best for Small Business</NuxtLink></li>
        <li><NuxtLink to="/best-of/ecommerce">Best for E‑commerce</NuxtLink></li>
        <li><NuxtLink to="/best-of/support">Best for Customer Support</NuxtLink></li>
        <li><NuxtLink to="/best-of/sales">Best for Sales Teams</NuxtLink></li>
      </ul>
    </section>
  </UiContainer>
</template>
<script setup lang="ts">
import UiContainer from '@/components/UiContainer.vue'
</script>