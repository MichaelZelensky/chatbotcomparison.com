<template>
  <section class="flex flex-col gap-6">
    <header class="flex flex-col gap-2">
      <h1 class="text-2xl md:text-3xl font-semibold">Chatbot Comparison</h1>
      <p class="small max-w-3xl">
        Snapshot comparison of leading AI chatbots. Use the table below or open detailed “A vs B” pages.
      </p>
    </header>

    <FeatureTable :features="features" :bots="bots" />

    <section class="grid md:grid-cols-2 gap-4">
      <div class="card">
        <h2 class="text-lg font-semibold mb-2">Popular comparisons</h2>
        <ul class="list-disc pl-5">
          <li><NuxtLink to="/compare/chatgpt-vs-gemini">ChatGPT vs Gemini</NuxtLink></li>
          <li><NuxtLink to="/compare/claude-vs-chatgpt">Claude vs ChatGPT</NuxtLink></li>
          <li><NuxtLink to="/compare/claude-vs-gemini">Claude vs Gemini</NuxtLink></li>
          <li><NuxtLink to="/compare/perplexity-vs-chatgpt">Perplexity vs ChatGPT</NuxtLink></li>
        </ul>
      </div>

      <div class="card small">
        <strong>Disclaimer:</strong> This site provides independent summaries. Features and pricing change frequently—please verify on the vendor website before deciding.
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import bots from '~/data/chatbots.json';
import features from '~/data/features.json';

const title = 'Chatbot Comparison — Feature table of popular AI chatbots';
const description = 'Compare ChatGPT, Gemini, Claude, Perplexity and more. Quickly scan pricing, free tiers, web browsing, image understanding, API access, and other key features.';

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogType: 'website',
  twitterCard: 'summary_large_image'
});

// JSON-LD via useHead
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Chatbot Comparison",
        "url": "https://chatbotcomparison.com",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://chatbotcomparison.com/?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      })
    }
  ]
});
</script>