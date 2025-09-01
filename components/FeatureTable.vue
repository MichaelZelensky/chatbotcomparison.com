<script setup lang="ts">
type Feature = { key: string; label: string; type: 'boolean' | 'text' };
type Bot = Record<string, any> & { name: string; slug: string; homepage?: string };

const props = defineProps<{
  features: Feature[];
  bots: Bot[];
}>();

const check = '✓';
const minus = '—';
</script>

<template>
  <div class="table-wrap">
    <table class="compare" aria-describedby="tableDescription">
      <caption id="tableDescription" class="sr-only">
        Feature comparison of popular AI chatbots
      </caption>
      <thead>
        <tr>
          <th scope="col">Feature</th>
          <th v-for="bot in bots" :key="bot.slug" scope="col">
            <div class="flex items-center gap-2">
              <NuxtLink :to="`/compare/${bot.slug}-vs-${bots[0].slug === bot.slug ? (bots[1]?.slug ?? bots[0].slug) : bots[0].slug}`">
                {{ bot.name }}
              </NuxtLink>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="f in features" :key="f.key">
          <th scope="row">{{ f.label }}</th>
          <td v-for="bot in bots" :key="bot.slug + f.key">
            <template v-if="f.type === 'boolean'">
              <span :aria-label="bot[f.key] ? 'Yes' : 'No'">{{ bot[f.key] ? check : minus }}</span>
            </template>
            <template v-else>
              <span>{{ bot[f.key] ?? '—' }}</span>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
