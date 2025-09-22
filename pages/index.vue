<template>
  <section class="flex flex-col gap-4">
    <FeatureTable />
    <Disclaimer class="mt-12"/>
  </section>
</template>

<script setup lang="ts">

const title = 'Chatbot Comparison: Feature table of popular AI chatbots';
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