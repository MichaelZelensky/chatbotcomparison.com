<template>
  <section>
    <h1 class="title">Chatbot Comparison</h1>

    <div v-if="columns.length && groups.length" class="table-wrap">
      <table class="compare" aria-describedby="tableDescription">
        <caption id="tableDescription" class="sr-only">
          Feature comparison of chatbot providers and plans
        </caption>

        <thead>
          <tr>
            <th scope="column">Feature</th>
            <th v-for="column in columns" :key="column.key" scope="column">
              <div class="column-heading">
                <div class="text-xs opacity-70">{{ column.providerName }}</div>
                <div>{{ column.planName }}</div>
              </div>
            </th>
          </tr>
        </thead>

        <tbody v-for="featureGroup in groups" :key="featureGroup.id">
          <tr class="group-row">
            <th :colspan="columns.length + 1" scope="rowgroup">
              {{ featureGroup.label }}
            </th>
          </tr>

          <tr
            v-for="featureRow in featureGroup.rows"
            :key="featureGroup.id + '-' + featureRow.key"
          >
            <th scope="row" class="row-heading">
              <div class="feat">
                <span>{{ featureRow.label }}</span>
                <button
                  class="tip"
                  :aria-label="featureRow.description"
                  :title="featureRow.description"
                >ⓘ</button>
              </div>
            </th>

            <td
              v-for="column in columns"
              :key="column.key + '-' + featureRow.key"
            >
              <span
                :aria-label="ariaLabel(valueOf(column.providerSlug, column.planSlug, featureRow.key), featureRow.type)"
              >
                {{ formatValue(valueOf(column.providerSlug, column.planSlug, featureRow.key), featureRow.type) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

    </div>

    <p v-else class="small">No data to display.</p>
  </section>
</template>

<script setup lang="ts">
type FeatureType = 'boolean' | 'text' | 'number';
type FeatureRow = { key: string; label: string; type: FeatureType; description: string };
type FeatureGroup = { id: string; label: string; rows: FeatureRow[] };
type Plan = { name: string; slug: string };
type Provider = { name: string; slug: string; homepage: string; plans: Plan[] };

import groupsJson from '~/data/feature-groups.json';
import providersJson from '~/data/providers.json';
import planValues from '~/data/plan-values.json';

const groups = groupsJson as FeatureGroup[];
const providers = providersJson as Provider[];

type Col = { key: string; providerSlug: string; planSlug: string; providerName: string; planName: string; };
const columns: Col[] = providers.flatMap(p =>
  p.plans.map(pl => ({
    key: `${p.slug}.${pl.slug}`,
    providerSlug: p.slug,
    planSlug: pl.slug,
    providerName: p.name,
    planName: pl.name
  }))
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const valueOf = (prov: string, plan: string, featureKey: string) => (planValues as any)?.[prov]?.[plan]?.[featureKey] ?? null;

const formatValue = (val: unknown, type: FeatureType): string => {
  if (val === null || val === undefined) return '—';
  if (type === 'boolean') return val ? '✓' : '—';
  return String(val);
};

const ariaLabel = (val: unknown, type: FeatureType): string => {
  if (val === null || val === undefined) return 'Not available';
  if (type === 'boolean') return (val ? 'Yes' : 'No');
  return String(val);
};
</script>

<style scoped lang="scss">
.title { @apply text-lg font-bold mb-4; }
.column-heading { @apply leading-tight; }

.group-row > th {
  @apply bg-transparent text-sm uppercase tracking-wide text-[color:var(--muted)];
  border-bottom: 1px solid var(--border);
}

.row-heading .feat { @apply flex items-center gap-2; }
.tip {
  @apply inline-flex items-center justify-center text-xs rounded-full border;
  width: 18px; height: 18px; line-height: 1;
  border-color: var(--border); color: var(--muted); background: transparent;
}
.tip:hover { color: var(--fg); }
.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
}
</style>
