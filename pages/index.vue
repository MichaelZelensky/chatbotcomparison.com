<template>
  <div>
    <section class="hero bg-zinc-50 py-14 md:py-20">
      <UiContainer>
        <h1 class="title">Find the Right Chatbot or Web‑Assistant for Your Business</h1>
        <p class="subtitle max-w-3xl">Use our interactive comparison hub to evaluate CRM bots, sales bots, support bots, and e‑commerce assistants. Filter by features, price, and use case.</p>
        <div class="cta">
          <NuxtLink class="btn btn-primary" to="/comparison">Open Comparison Table</NuxtLink>
          <NuxtLink class="btn" to="/best-of">See Best‑of Lists</NuxtLink>
        </div>
      </UiContainer>
    </section>

    <section class="py-12">
      <UiContainer>
        <div class="grid gap-6 md:grid-cols-2">
          <div class="card">
            <h3 class="text-lg font-semibold">Top categories</h3>
            <ul class="mt-3 list-disc pl-5 text-zinc-700">
              <li><NuxtLink to="/categories/crm-bots">CRM Bots</NuxtLink></li>
              <li><NuxtLink to="/categories/sales-bots">Sales Bots</NuxtLink></li>
              <li><NuxtLink to="/categories/support-bots">Support Bots</NuxtLink></li>
              <li><NuxtLink to="/categories/ecommerce-bots">E‑commerce Bots</NuxtLink></li>
              <li><NuxtLink to="/categories/diy-integrators">DIY / Integrators</NuxtLink></li>
            </ul>
          </div>
          <ComparisonTablePreview />
        </div>
      </UiContainer>
    </section>

    <PinCompareBar />
  </div>
</template>
<script setup lang="ts">
import UiContainer from '@/components/UiContainer.vue'
import ComparisonTablePreview from '@/components/ComparisonTablePreview.vue'
import PinCompareBar from '@/components/PinCompareBar.vue'
</script>