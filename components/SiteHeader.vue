<template>
  <header class="w-full border-b" style="border-color: var(--border)">
    <div class="w-full py-4 px-4 md:px-8 flex items-center justify-between">
      <NuxtLink
        to="/"
        class="text-xl font-semibold hover:opacity-90"
      >
        Chatbot Comparison
      </NuxtLink>

      <nav class="text-sm flex items-center gap-6">
        <NuxtLink to="/">Feature Compare Table</NuxtLink>
        <NuxtLink to="/compare">Compare Providers</NuxtLink>
        <NuxtLink to="/features">Features</NuxtLink>
      </nav>
    </div>
  </header>
</template>
