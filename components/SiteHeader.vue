<template>
  <header class="border-b border-zinc-200 bg-white sticky top-0 z-50">
    <UiContainer>
      <div class="flex h-14 items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2 no-underline">
          <Icon name="bi:chat-left-text" />
          <span class="font-semibold">ChatbotComparison</span>
        </NuxtLink>
        <nav class="hidden md:flex items-center gap-6 text-sm">
          <NuxtLink to="/comparison">Compare</NuxtLink>
          <NuxtLink to="/best-of">Best‑of</NuxtLink>
          <NuxtLink to="/guides">Guides</NuxtLink>
          <NuxtLink to="/pricing">Pricing</NuxtLink>
          <NuxtLink to="/about">About</NuxtLink>
          <NuxtLink to="/contact">Contact</NuxtLink>
        </nav>
        <div class="flex items-center gap-2">
          <NuxtLink class="btn btn-primary" to="/comparison">Start Comparing</NuxtLink>
        </div>
      </div>
    </UiContainer>
  </header>
</template>
<script setup lang="ts"></script>