<template>
  <footer class="mt-20 border-t border-zinc-200 py-10 text-sm bg-white">
    <UiContainer>
      <div class="grid gap-8 md:grid-cols-4">
        <div>
          <div class="font-semibold mb-2">ChatbotComparison</div>
          <p class="text-zinc-600">Reviews, comparisons, and buying guides for web‑chat and assistant solutions.</p>
        </div>
        <div>
          <div class="font-semibold mb-2">Explore</div>
          <ul class="space-y-1">
            <li><NuxtLink to="/comparison">Comparison Hub</NuxtLink></li>
            <li><NuxtLink to="/best-of">Best‑of Lists</NuxtLink></li>
            <li><NuxtLink to="/guides">Guides</NuxtLink></li>
          </ul>
        </div>
        <div>
          <div class="font-semibold mb-2">Company</div>
          <ul class="space-y-1">
            <li><NuxtLink to="/pricing">Pricing & Deals</NuxtLink></li>
            <li><NuxtLink to="/about">About & Methodology</NuxtLink></li>
            <li><NuxtLink to="/contact">Contact</NuxtLink></li>
          </ul>
        </div>
        <div>
          <div class="font-semibold mb-2">Legal</div>
          <p class="text-zinc-600">© {{ new Date().getFullYear() }} chatbotcomparison.com</p>
        </div>
      </div>
    </UiContainer>
  </footer>
</template>
<script setup lang="ts"></script>