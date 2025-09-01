<!-- pages/index.vue -->
<template>
  <section class="container">
    <h1 class="title">Chatbot Comparison</h1>

    <FeatureTable
      v-if="bots.length && features.length"
      :bots="bots"
      :features="features"
    />
    <p v-else class="muted">Loading comparison…</p>
  </section>
</template>

<script setup lang="ts">
import FeatureTable from '@/components/FeatureTable.vue'

const { data: bots } = await useAsyncData('bots', async () => [
  { name: 'ChatGPT', slug: 'chatgpt', contextWindow: '128k', api: true },
  { name: 'Claude', slug: 'claude', contextWindow: '200k', api: true },
  { name: 'Gemini', slug: 'gemini', contextWindow: '1M (Pro)', api: true }
])

const features = [
  { key: 'contextWindow', label: 'Context window', type: 'text' },
  { key: 'api',            label: 'API available',  type: 'boolean' }
]

// JSON-LD MUST NOT be in the template; put it in head:
useHead({
  script: [{
    type: 'application/ld+json',
    // @ts-expect-error: innerHTML is allowed by useHead
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Chatbot Comparison',
      url: 'https://chatbotcomparison.com'
    })
  }]
})
</script>

<style lang="scss" scoped>
/* assets/styles/table.scss */
.table-wrap { overflow-x: auto; }
.compare {
  width: 100%;
  border-collapse: collapse;
}
.compare th, .compare td {
  padding: .5rem .75rem;
  border: 1px solid var(--border, #e2e8f0);
  vertical-align: top;
}
.compare thead th {
  position: sticky; top: 0;
  background: var(--card, #f8fafc);
  z-index: 1;
}
.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
}

</style>