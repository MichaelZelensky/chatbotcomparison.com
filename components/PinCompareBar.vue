<template>
  <div class="sticky bottom-4 z-40">
    <div class="container-x">
      <div class="rounded-xl border border-zinc-200 bg-white/90 backdrop-blur px-4 py-3 shadow-lg">
        <div class="flex items-center justify-between gap-4">
          <div class="text-sm text-zinc-700">Pin vendors to compare side‑by‑side.</div>
          <div class="flex gap-2">
            <button class="btn">2 pinned</button>
            <NuxtLink class="btn btn-primary" to="/comparison">Compare Now</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts"></script>