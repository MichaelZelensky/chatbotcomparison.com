<template>
  <section class="container">
    <h1 class="title">Chatbot Comparison</h1>

    <div v-if="chatbots.length && featureDefs.length" class="table-wrap">
      <table class="compare" aria-describedby="tableDescription">
        <caption id="tableDescription" class="sr-only">
          Feature comparison of popular AI chatbots
        </caption>

        <thead>
          <tr>
            <th scope="col">Feature</th>
            <th v-for="bot in chatbots" :key="bot.slug" scope="col">
              <div class="flex items-center gap-2">
                <a :href="bot.homepage" target="_blank" rel="noopener" :title="`${bot.name} homepage`">
                  {{ bot.name }}
                </a>
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="def in featureDefs" :key="def.key">
            <th scope="row">{{ def.label }}</th>
            <td v-for="bot in chatbots" :key="`${bot.slug}-${def.key}`">
              <template v-if="def.type === 'boolean'">
                <span class="bool" :class="(bot as Record<string, unknown>)[def.key] ? 'yes' : 'no'">
                  <svg v-if="(bot as Record<string, unknown>)[def.key]" xmlns="http://www.w3.org/2000/svg" width="16" height="16" aria-hidden="true" viewBox="0 0 24 24">
                    <path d="M20.285 6.709a1 1 0 0 1 0 1.414l-9.192 9.192a1 1 0 0 1-1.414 0L3.715 10.55a1 1 0 1 1 1.414-1.414l5.243 5.243 8.485-8.485a1 1 0 0 1 1.428 0Z"/>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" aria-hidden="true" viewBox="0 0 24 24">
                    <path d="M18.3 5.7a1 1 0 0 1 0 1.4L13.4 12l4.9 4.9a1 1 0 1 1-1.4 1.4L12 13.4l-4.9 4.9a1 1 0 0 1-1.4-1.4L10.6 12 5.7 7.1A1 1 0 0 1 7.1 5.7L12 10.6l4.9-4.9a1 1 0 0 1 1.4 0Z"/>
                  </svg>
                  <span class="sr-only">{{ (bot as Record<string, unknown>)[def.key] ? 'Yes' : 'No' }}</span>
                </span>
              </template>
              <template v-else>
                {{ (bot as Record<string, unknown>)[def.key] ?? '—' }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-else class="muted">No data to display.</p>
  </section>
</template>

<script setup lang="ts">
import defaultChatbots from '~/data/chatbots.json'
import defaultFeatureDefs from '~/data/features.json'

type FeatureType = 'text' | 'boolean'
export type FeatureDef = {
  key: string
  label: string
  type: FeatureType
}

export type Chatbot = {
  name: string
  slug: string
  homepage: string
  price?: string
  freeTier?: boolean
  webBrowsing?: boolean
  imageUnderstanding?: boolean
  apiAvailable?: boolean
  notes?: string
  // Allow future keys
  [key: string]: unknown
}

// Fallback to JSON files if props not passed
const chatbots = (defaultChatbots as Chatbot[])
const featureDefs = (defaultFeatureDefs as FeatureDef[])

// JSON-LD in <head>, not template
useHead({
  script: [
    {
      type: 'application/ld+json',
      // @ts-expect-error: innerHTML is permitted by useHead
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Chatbot Comparison',
        url: 'https://chatbotcomparison.com'
      })
    }
  ]
})
</script>

<style lang="scss" scoped>
.table-wrap { overflow-x: auto; }
.compare { width: 100%; border-collapse: collapse; }
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
.bool {
  display: inline-flex; align-items: center; justify-content: center;
  width: 1.6rem; height: 1.6rem; border-radius: .4rem;
  border: 1px solid var(--border, #e2e8f0);
  svg { display: block; }
}
.bool.yes { background: #ecfeff; fill: #06b6d4; border-color: #cffafe; }
.bool.no  { background: #fef2f2; fill: #ef4444; border-color: #fee2e2; }

.muted { color: var(--muted, #475569); }
</style>
