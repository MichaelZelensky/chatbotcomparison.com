<template>
  <footer class="mt-12 border-t" style="border-color: var(--border)">
    <div class="container py-8 small flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
      <div>
        © {{ new Date().getFullYear() }} Chatbot Comparison. Independent feature snapshots; verify details on vendor sites.
      </div>
      <div class="flex gap-4">
        <NuxtLink to="/">Home</NuxtLink>
        <a href="https://liteed.com" target="_blank" rel="noopener">Liteed</a>
      </div>
    </div>
  </footer>
</template>
