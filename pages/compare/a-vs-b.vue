<script setup lang="ts">
import bots from '~/data/chatbots.json';
import features from '~/data/features.json';
import { normalizePair } from '~/utils/slug';

const route = useRoute();
const params = route.params as { a: string; b: string };

const { a, b } = normalizePair(params.a, params.b);
const left = (bots as any[]).find((x) => x.slug === a);
const right = (bots as any[]).find((x) => x.slug === b);
if (!left || !right) throw createError({ statusCode: 404, statusMessage: 'Comparison not found' });

const title = `${left.name} vs ${right.name} — Which AI chatbot is better for you?`;
const description = `Quick head-to-head: ${left.name} vs ${right.name}. Compare pricing, free tier, web browsing, image understanding, API access and more.`;

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogType: 'article',
  twitterCard: 'summary_large_image'
});

const siteUrl = useRuntimeConfig().public.siteUrl;
const canonicalPath = `/compare/${a}-vs-${b}`;

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": `${siteUrl}/` },
          { "@type": "ListItem", "position": 2, "name": `${left.name} vs ${right.name}`, "item": `${siteUrl}${canonicalPath}` }
        ]
      })
    }
  ]
});
</script>

<template>
  <article class="flex flex-col gap-6">
    <header class="flex flex-col gap-2">
      <h1 class="text-2xl md:text-3xl font-semibold">{{ left.name }} vs {{ right.name }}</h1>
      <p class="small">Head-to-head comparison to help you choose faster.</p>
    </header>

    <!-- Mini hero: key differences -->
    <section class="grid md:grid-cols-2 gap-4">
      <div class="card">
        <h2 class="text-lg font-semibold mb-2">{{ left.name }} at a glance</h2>
        <ul class="list-disc pl-5 small">
          <li><strong>Pricing:</strong> {{ left.price || '—' }}</li>
          <li><strong>Free tier:</strong> {{ left.freeTier ? 'Yes' : 'No' }}</li>
          <li><strong>Web browsing:</strong> {{ left.webBrowsing ? 'Yes' : 'No' }}</li>
          <li><strong>Image understanding:</strong> {{ left.imageUnderstanding ? 'Yes' : 'No' }}</li>
          <li><strong>API:</strong> {{ left.apiAvailable ? 'Yes' : 'No' }}</li>
        </ul>
        <div class="mt-3 small"><a :href="left.homepage" target="_blank" rel="noopener">Visit {{ left.name }}</a></div>
      </div>

      <div class="card">
        <h2 class="text-lg font-semibold mb-2">{{ right.name }} at a glance</h2>
        <ul class="list-disc pl-5 small">
          <li><strong>Pricing:</strong> {{ right.price || '—' }}</li>
          <li><strong>Free tier:</strong> {{ right.freeTier ? 'Yes' : 'No' }}</li>
          <li><strong>Web browsing:</strong> {{ right.webBrowsing ? 'Yes' : 'No' }}</li>
          <li><strong>Image understanding:</strong> {{ right.imageUnderstanding ? 'Yes' : 'No' }}</li>
          <li><strong>API:</strong> {{ right.apiAvailable ? 'Yes' : 'No' }}</li>
        </ul>
        <div class="mt-3 small"><a :href="right.homepage" target="_blank" rel="noopener">Visit {{ right.name }}</a></div>
      </div>
    </section>

    <!-- Full feature table -->
    <section>
      <h2 class="text-lg font-semibold mb-3">Detailed feature comparison</h2>
      <div class="table-wrap">
        <table class="compare">
          <thead>
            <tr>
              <th scope="col">Feature</th>
              <th scope="col">{{ left.name }}</th>
              <th scope="col">{{ right.name }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="f in (features as any[])" :key="f.key">
              <th scope="row">{{ f.label }}</th>
              <td>
                <template v-if="f.type === 'boolean'">{{ left[f.key] ? '✓' : '—' }}</template>
                <template v-else>{{ left[f.key] ?? '—' }}</template>
              </td>
              <td>
                <template v-if="f.type === 'boolean'">{{ right[f.key] ? '✓' : '—' }}</template>
                <template v-else>{{ right[f.key] ?? '—' }}</template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="small">
      <p><strong>Notes:</strong> This page summarizes public information and common usage patterns. Features change rapidly—please confirm on vendor sites.</p>
    </section>
  </article>
</template>
