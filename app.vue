<template>
  <div>
    <SiteHeader />
    <main>
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>
<script setup lang="ts">
import SiteHeader from '@/components/SiteHeader.vue'
import SiteFooter from '@/components/SiteFooter.vue'
</script>