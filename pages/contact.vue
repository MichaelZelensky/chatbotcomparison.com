<template>
  <UiContainer>
    <section class="py-10">
      <h1 class="text-3xl font-bold">Contact</h1>
      <form class="mt-6 max-w-xl space-y-4">
        <input class="w-full border rounded px-3 py-2" placeholder="Your name" />
        <input class="w-full border rounded px-3 py-2" placeholder="Email" type="email" />
        <textarea class="w-full border rounded px-3 py-2" rows="5" placeholder="Message" />
        <button type="button" class="btn btn-primary">Send</button>
      </form>
    </section>
  </UiContainer>
</template>
<script setup lang="ts">
import UiContainer from '@/components/UiContainer.vue'
</script>