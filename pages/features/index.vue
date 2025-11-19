<template>
  <section>
    <h1>All features</h1>
    <ul class="mt-4">
      <li><NuxtLink to="/features/additionalAgentPrice">Additional Agents (per month)</NuxtLink></li>
      <li><NuxtLink to="/features/agentsIncluded">Agents Included</NuxtLink></li>
      <li><NuxtLink to="/features/planPrice">Plan Price (per month)</NuxtLink></li>
    </ul>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'content' });
useSeoMeta({ title: 'All features' });
</script>
