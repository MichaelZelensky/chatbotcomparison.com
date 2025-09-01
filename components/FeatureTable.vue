<template>
  <section>
    <h1 class="title">Chatbot Comparison</h1>

    <div v-if="chatbots.length && featureDefs.length" class="table-wrap">
      <table class="compare" aria-describedby="tableDescription">
        <caption id="tableDescription" class="sr-only">Feature comparison of popular AI chatbots</caption>

        <thead>
          <tr>
            <th scope="col">Feature</th>
            <th v-for="bot in chatbots" :key="bot.slug" scope="col">
              <div class="col-heading">{{ bot.name }}</div>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="feature in featureDefs" :key="feature.key">
            <th scope="row" class="row-heading">{{ feature.label }}</th>
            <td v-for="bot in chatbots" :key="`${bot.slug}-${feature.key}`">
              <template v-if="feature.type === 'boolean'">
                <span class="bool" :class="(bot as Record<string, unknown>)[feature.key] ? 'yes' : 'no'">
                  <svg v-if="(bot as Record<string, unknown>)[feature.key]" xmlns="http://www.w3.org/2000/svg" width="16" height="16" aria-hidden="true" viewBox="0 0 24 24">
                    <path d="M20.285 6.709a1 1 0 0 1 0 1.414l-9.192 9.192a1 1 0 0 1-1.414 0L3.715 10.55a1 1 0 1 1 1.414-1.414l5.243 5.243 8.485-8.485a1 1 0 0 1 1.428 0Z"/>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" aria-hidden="true" viewBox="0 0 24 24">
                    <path d="M18.3 5.7a1 1 0 0 1 0 1.4L13.4 12l4.9 4.9a1 1 0 1 1-1.4 1.4L12 13.4l-4.9 4.9a1 1 0 0 1-1.4-1.4L10.6 12 5.7 7.1A1 1 0 0 1 7.1 5.7L12 10.6l4.9-4.9a1 1 0 0 1 1.4 0Z"/>
                  </svg>
                  <span class="sr-only">{{ (bot as Record<string, unknown>)[feature.key] ? 'Yes' : 'No' }}</span>
                </span>
              </template>
              <template v-else>
                {{ (bot as Record<string, unknown>)[feature.key] ?? '—' }}
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
export type FeatureDef = { key: string; label: string; type: FeatureType }
export type Chatbot = {
  name: string; slug: string; homepage: string;
  price?: string; freeTier?: boolean; webBrowsing?: boolean;
  imageUnderstanding?: boolean; apiAvailable?: boolean; notes?: string;
  [key: string]: unknown
}

const chatbots = defaultChatbots as Chatbot[]
const featureDefs = defaultFeatureDefs as FeatureDef[]

useHead({
  script: [{ type: 'application/ld+json',
    // @ts-expect-error innerHTML is allowed by useHead
    innerHTML: JSON.stringify({ '@context':'https://schema.org', '@type':'WebSite', name:'Chatbot Comparison', url:'https://chatbotcomparison.com' })
  }]
})
</script>

<style lang="scss" scoped>
.sr-only { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }

.muted { color: var(--muted, #475569); }

/* compact, accessible headings */
.col-heading { @apply font-semibold text-slate-800 dark:text-slate-100; }
.row-heading { @apply font-medium text-slate-900 dark:text-slate-100; }

/* boolean badges */
.bool { @apply inline-flex items-center justify-center w-6 h-6 rounded border;
  border-color: var(--border, #e2e8f0);
  svg { display:block; }
}
.bool.yes { @apply bg-cyan-50 fill-cyan-500; border-color:#cffafe; }
.bool.no  { @apply bg-rose-50 fill-red-500;  border-color:#fee2e2; }

/* scroll container */
.table-wrap { max-width:100%; overflow-x:auto; -webkit-overflow-scrolling:touch; contain:content; }

/* table */
.compare { width:max-content; min-width:100%; border-collapse:separate; border-spacing:0; }
.compare thead th, .compare thead td { position:sticky; top:0; z-index:3; background:var(--card,#f8fafc); @apply font-semibold; }
.compare tbody th[scope='row'] { position:sticky; left:0; z-index:2; background:var(--card,#f8fafc); box-shadow: inset -8px 0 8px -8px rgba(0,0,0,.08); }
.compare thead th:first-child { position:sticky; top:0; left:0; z-index:4; background:var(--card,#f8fafc); }
.compare th, .compare td { @apply p-2; border:1px solid var(--border,#e2e8f0); vertical-align:top; word-break:break-word; overflow-wrap:anywhere; }
</style>
